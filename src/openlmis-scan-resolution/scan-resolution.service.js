/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-scan-resolution.scanResolutionService
     *
     * @description
     * Applies a scan to a screen: finds the product among the ones the screen loaded, matches the
     * scanned batch within it, then counts the line that is already there or adds one.
     *
     * Nothing here knows what a screen's rows look like, what its workflow allows, or how it words a
     * refusal - all of that arrives in the strategy. That is what lets the stock screens share this
     * with, in time, a requisition or a shipment, none of which agree on a row shape.
     */
    angular
        .module('openlmis-scan-resolution')
        .service('scanResolutionService', service);

    service.$inject = ['$q', 'SCAN_RESOLUTION_ERROR', 'SCAN_CONFIRMATION'];

    function service($q, SCAN_RESOLUTION_ERROR, SCAN_CONFIRMATION) {

        this.resolve = resolve;

        /**
         * @ngdoc method
         * @methodOf openlmis-scan-resolution.scanResolutionService
         * @name resolve
         *
         * @description
         * Resolves a scan against a screen and applies it. Rejects with the screen's own message key
         * for the failure, or with the SCAN_RESOLUTION_ERROR code when the screen declared no wording.
         *
         * The strategy carries everything screen specific:
         *
         * - `orderableGroups` the groups the screen loaded, which is what scopes a scan to the products
         *                     valid where it was made
         * - `lineItems`       the lines already on the screen
         * - `tracksLots`      whether rows are per batch; a screen without batches matches on product
         * - `allowsNewLot`    whether this workflow may count a batch it has no record of
         * - `addLine`         called with the group and the matched lot; should return the line it
         *                     created, so the scan that added it also counts
         * - `countLine`       called with the line the scan counted; the screen applies its own
         *                     quantity semantics, since a pack of doses and a requested quantity are
         *                     not the same thing
         * - `confirm`         optional; called with `{reason, lot, scan}` before a scan that needs
         *                     acknowledging is applied - see SCAN_CONFIRMATION. Resolve to go ahead,
         *                     reject to discard the scan
         * - `focusLine`       optional; called with the line the scan counted
         * - `messages`        optional; SCAN_RESOLUTION_ERROR code to message key. A refusal then
         *                     carries `{messageKey, messageParams}` with the scanned gtin and lot code,
         *                     so the wording can name them; with no wording declared it is the code
         *
         * @param  {Object}  scan      the parsed scan
         * @param  {Object}  tradeItem the trade item the GTIN resolved to
         * @param  {Object}  strategy  the screen's rows, callbacks, policy and wording
         * @return {Promise}           resolves with the line the scan counted
         */
        function resolve(scan, tradeItem, strategy) {
            var groups = groupsOf(strategy).filter(function(group) {
                    return isForTradeItem(group, tradeItem);
                }),
                group,
                lot;

            if (!groups.length) {
                return refuse(strategy, SCAN_RESOLUTION_ERROR.PRODUCT_NOT_AVAILABLE, scan);
            }

            if (groups.length > 1) {
                return refuse(strategy, SCAN_RESOLUTION_ERROR.PRODUCT_AMBIGUOUS, scan);
            }

            group = groups[0];

            /*
             * A screen whose rows are not per batch has one line per product, so the batch on the label
             * is read and ignored rather than matched.
             */
            if (!strategy.tracksLots) {
                return apply(group, withoutLot(), strategy);
            }

            lot = findLot(group, scan.lotCode);

            if (!lot) {
                if (!scan.lotCode || !strategy.allowsNewLot) {
                    return refuse(strategy, scan.lotCode
                        ? SCAN_RESOLUTION_ERROR.LOT_NOT_AVAILABLE
                        : SCAN_RESOLUTION_ERROR.LOT_REQUIRED, scan);
                }
                lot = pendingLot(scan);

                return confirmed(strategy, SCAN_CONFIRMATION.NEW_LOT, lot, scan)
                    .then(function() {
                        return apply(group, lot, strategy);
                    });
            }

            if (disagreesOnExpiry(lot, scan)) {
                return confirmed(strategy, SCAN_CONFIRMATION.EXPIRY_MISMATCH, lot, scan)
                    .then(function() {
                        return apply(group, lot, strategy);
                    });
            }

            return apply(group, lot, strategy);
        }

        /**
         * A screen may want the user to acknowledge something before the scan lands - a batch about to
         * be added, or a label that disagrees with what was recorded. The screen decides whether that
         * means a dialog: a workflow where the situation is routine simply accepts.
         *
         * Declining is not an error in the screen's data, so it refuses with its own code rather than
         * one of the not-found ones.
         */
        function confirmed(strategy, reason, lot, scan) {
            if (!angular.isFunction(strategy.confirm)) {
                return $q.resolve();
            }

            return $q.when(strategy.confirm({
                reason: reason,
                lot: lot,
                scan: scan
            }))
                .catch(function() {
                    return $q.reject(refusalFor(strategy, SCAN_RESOLUTION_ERROR.NOT_CONFIRMED, scan));
                });
        }

        /**
         * Compared as wire format dates. A recorded expiry is a Date on a freshly loaded screen and a
         * string once a draft has been through its cache, so comparing the values themselves would
         * report a mismatch on batches that agree.
         */
        function disagreesOnExpiry(lot, scan) {
            var recorded = asIsoDate(lot.expirationDate),
                scanned = asIsoDate(scan.expirationDate);

            return Boolean(recorded) && Boolean(scanned) && recorded !== scanned;
        }

        function asIsoDate(value) {
            if (!value) {
                return undefined;
            }

            if (angular.isString(value)) {
                return value.substring(0, 10);
            }

            return [
                value.getFullYear(),
                padTwo(value.getMonth() + 1),
                padTwo(value.getDate())
            ].join('-');
        }

        function padTwo(number) {
            return number < 10 ? '0' + number : String(number);
        }

        function apply(group, lot, strategy) {
            var existing = findLineItem(strategy, group, lot),
                added;

            if (existing) {
                return $q.resolve(count(existing, strategy));
            }

            added = strategy.addLine(group, lot.$noLot ? undefined : lot);

            /*
             * The scan that adds a line is itself a count, so a new line does not start empty. A screen
             * that adds nothing, or reports nothing back, is left alone.
             */
            return $q.resolve(added ? count(added, strategy) : added);
        }

        function count(lineItem, strategy) {
            strategy.countLine(lineItem);

            if (angular.isFunction(strategy.focusLine)) {
                strategy.focusLine(lineItem);
            }

            return lineItem;
        }

        /**
         * The screen's wording if it declared any, and the bare code if it did not - which keeps a new
         * consumer working before it has written its messages.
         *
         * The codes that arrived on the label travel with the refusal, so a message can name what
         * failed to match: a clerk holding a box needs to know which of the two codes on it was not
         * recognised, and a support ticket saying "the scan did not work" costs a site visit.
         */
        function refuse(strategy, code, scan) {
            return $q.reject(refusalFor(strategy, code, scan));
        }

        function refusalFor(strategy, code, scan) {
            var key = strategy.messages && strategy.messages[code];

            if (!key) {
                return code;
            }

            return {
                messageKey: key,
                messageParams: {
                    gtin: scan.gtin,
                    lotCode: scan.lotCode
                }
            };
        }

        function groupsOf(strategy) {
            return strategy.orderableGroups || [];
        }

        function isForTradeItem(group, tradeItem) {
            return group.some(function(groupItem) {
                var identifiers = groupItem.orderable ? groupItem.orderable.identifiers : undefined;

                return identifiers && identifiers.tradeItem === tradeItem.id;
            });
        }

        /**
         * Batch codes are matched without regard to case, which is how referencedata treats them for
         * uniqueness. A scan carrying no batch code matches the group's no batch entry, if it has one.
         */
        function findLot(group, lotCode) {
            var matched;

            if (!lotCode) {
                return group.some(isNoLotItem) ? withoutLot() : undefined;
            }

            matched = group.filter(function(groupItem) {
                return groupItem.lot && isSameCode(groupItem.lot.lotCode, lotCode);
            });

            return matched.length ? matched[0].lot : undefined;
        }

        function withoutLot() {
            return {
                $noLot: true
            };
        }

        function isNoLotItem(groupItem) {
            return !groupItem.lot;
        }

        /**
         * A batch the screen has no record of. It carries no id, which is what tells the screen it still
         * has to be created.
         */
        function pendingLot(scan) {
            return {
                lotCode: scan.lotCode,
                expirationDate: scan.expirationDate
            };
        }

        function findLineItem(strategy, group, lot) {
            var orderableId = orderableIdOf(group);

            return (strategy.lineItems || []).filter(function(lineItem) {
                return lineItem.orderable
                    && lineItem.orderable.id === orderableId
                    && isSameLot(lineItem.lot, lot);
            })[0];
        }

        /**
         * A pending batch has no id yet, so repeat scans of it are matched on code - otherwise every
         * scan of a new batch would add another row instead of counting up.
         */
        function isSameLot(lineItemLot, lot) {
            if (lot.$noLot) {
                return !lineItemLot;
            }

            if (!lineItemLot) {
                return false;
            }

            if (lot.id) {
                return lineItemLot.id === lot.id;
            }

            return !lineItemLot.id && isSameCode(lineItemLot.lotCode, lot.lotCode);
        }

        function orderableIdOf(group) {
            return group[0].orderable.id;
        }

        /**
         * A batch with no code is never the same as one that has one.
         */
        function isSameCode(one, other) {
            return Boolean(one) && Boolean(other) && one.toLowerCase() === other.toLowerCase();
        }
    }

})();
