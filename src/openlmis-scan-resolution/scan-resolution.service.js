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

    service.$inject = ['$q', 'SCAN_RESOLUTION_ERROR'];

    function service($q, SCAN_RESOLUTION_ERROR) {

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
         * - `focusLine`       optional; called with the line the scan counted
         * - `messages`        optional; SCAN_RESOLUTION_ERROR code to message key
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
                return refuse(strategy, SCAN_RESOLUTION_ERROR.PRODUCT_NOT_AVAILABLE);
            }

            if (groups.length > 1) {
                return refuse(strategy, SCAN_RESOLUTION_ERROR.PRODUCT_AMBIGUOUS);
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
                        : SCAN_RESOLUTION_ERROR.LOT_REQUIRED);
                }
                lot = pendingLot(scan);
            }

            return apply(group, lot, strategy);
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
         */
        function refuse(strategy, code) {
            return $q.reject(strategy.messages && strategy.messages[code] || code);
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
