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

describe('scanResolutionService', function() {

    beforeEach(function() {
        var scanResolutionService, resolutionError, confirmation, $rootScope, $q;

        module('openlmis-scan-resolution');

        inject(function($injector) {
            scanResolutionService = $injector.get('scanResolutionService');
            resolutionError = $injector.get('SCAN_RESOLUTION_ERROR');
            confirmation = $injector.get('SCAN_CONFIRMATION');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
        });

        this.service = scanResolutionService;
        this.ERROR = resolutionError;
        this.CONFIRMATION = confirmation;
        this.$rootScope = $rootScope;
        this.$q = $q;

        this.tradeItem = {
            id: 'trade-item-id'
        };
        this.orderable = {
            id: 'orderable-id',
            identifiers: {
                tradeItem: 'trade-item-id'
            }
        };
        this.lot = {
            id: 'lot-id',
            lotCode: 'ABC123'
        };

        this.group = [{
            orderable: this.orderable,
            lot: this.lot,
            stockOnHand: 100
        }];

        this.scan = {
            gtin: '05890123456786',
            lotCode: 'ABC123'
        };

        this.strategy = {
            orderableGroups: [this.group],
            lineItems: [],
            tracksLots: true,
            allowsNewLot: false,
            addLine: jasmine.createSpy('addLine'),
            countLine: jasmine.createSpy('countLine')
        };

        this.resolve = function(scan) {
            var outcome = {};

            this.service.resolve(scan || this.scan, this.tradeItem, this.strategy)
                .then(function(lineItem) {
                    outcome.resolved = true;
                    outcome.lineItem = lineItem;
                }, function(rejection) {
                    outcome.rejection = rejection;
                });
            this.$rootScope.$apply();

            return outcome;
        };
    });

    describe('when the product is not available', function() {

        it('should refuse when no group carries the trade item', function() {
            this.strategy.orderableGroups = [];

            expect(this.resolve().rejection).toEqual(this.ERROR.PRODUCT_NOT_AVAILABLE);
            expect(this.strategy.addLine).not.toHaveBeenCalled();
        });

        it('should refuse when more than one group carries the trade item', function() {
            this.strategy.orderableGroups = [this.group, angular.copy(this.group)];

            expect(this.resolve().rejection).toEqual(this.ERROR.PRODUCT_AMBIGUOUS);
            expect(this.strategy.addLine).not.toHaveBeenCalled();
        });
    });

    describe('when the batch cannot be matched', function() {

        it('should refuse for a workflow that cannot add one', function() {
            var outcome = this.resolve({
                gtin: this.scan.gtin,
                lotCode: 'UNKNOWN'
            });

            expect(outcome.rejection).toEqual(this.ERROR.LOT_NOT_AVAILABLE);
        });

        it('should refuse when the scan carries no batch code and the product is tracked by batch',
            function() {
                var outcome = this.resolve({
                    gtin: this.scan.gtin
                });

                expect(outcome.rejection).toEqual(this.ERROR.LOT_REQUIRED);
            });
    });

    describe('wording', function() {

        it('should refuse with the screen\'s own message key when it declared one', function() {
            this.strategy.orderableGroups = [];
            this.strategy.messages = {
                PRODUCT_NOT_AVAILABLE: 'stockScan.productNotOnScreen'
            };

            expect(this.resolve().rejection.messageKey).toEqual('stockScan.productNotOnScreen');
        });

        /**
         * A clerk holding a box needs to know which of the codes on it was not recognised.
         */
        it('should name the scanned codes in the refusal', function() {
            this.strategy.orderableGroups = [];
            this.strategy.messages = {
                PRODUCT_NOT_AVAILABLE: 'stockScan.productNotOnScreen'
            };

            expect(this.resolve().rejection.messageParams).toEqual({
                gtin: '05890123456786',
                lotCode: 'ABC123'
            });
        });

        it('should name the batch that could not be matched', function() {
            var outcome;

            this.strategy.messages = {
                LOT_NOT_AVAILABLE: 'stockScan.lotNotOnScreen'
            };

            outcome = this.resolve({
                gtin: this.scan.gtin,
                lotCode: 'UNKNOWN'
            });

            expect(outcome.rejection.messageKey).toEqual('stockScan.lotNotOnScreen');
            expect(outcome.rejection.messageParams.lotCode).toEqual('UNKNOWN');
        });

        it('should refuse with the code when the screen declared none for it', function() {
            this.strategy.orderableGroups = [];
            this.strategy.messages = {
                LOT_REQUIRED: 'stockScan.lotRequired'
            };

            expect(this.resolve().rejection).toEqual(this.ERROR.PRODUCT_NOT_AVAILABLE);
        });
    });

    describe('when the scan resolves', function() {

        it('should add a line for a product not yet on the screen', function() {
            var outcome = this.resolve();

            expect(outcome.resolved).toBe(true);
            expect(this.strategy.addLine).toHaveBeenCalledWith(this.group, this.lot);
        });

        it('should count the line it added', function() {
            var added = {
                orderable: this.orderable
            };

            this.strategy.addLine.andReturn(added);

            expect(this.resolve().lineItem).toBe(added);
            expect(this.strategy.countLine).toHaveBeenCalledWith(added);
        });

        it('should tolerate a screen that reports no line back', function() {
            this.strategy.addLine.andReturn(undefined);

            var outcome = this.resolve();

            expect(outcome.resolved).toBe(true);
            expect(this.strategy.countLine).not.toHaveBeenCalled();
        });

        it('should match the batch code without regard to case', function() {
            this.resolve({
                gtin: this.scan.gtin,
                lotCode: 'abc123'
            });

            expect(this.strategy.addLine).toHaveBeenCalledWith(this.group, this.lot);
        });

        it('should add a line with no batch when the group has a no batch entry', function() {
            this.group.push({
                orderable: this.orderable,
                lot: null,
                stockOnHand: 5
            });

            this.resolve({
                gtin: this.scan.gtin
            });

            expect(this.strategy.addLine).toHaveBeenCalledWith(this.group, undefined);
        });

        it('should hand the line to focusLine when the screen supplies one', function() {
            var added = {
                orderable: this.orderable
            };

            this.strategy.addLine.andReturn(added);
            this.strategy.focusLine = jasmine.createSpy('focusLine');

            this.resolve();

            expect(this.strategy.focusLine).toHaveBeenCalledWith(added);
        });
    });

    describe('when the screen does not track batches', function() {

        beforeEach(function() {
            this.strategy.tracksLots = false;
            this.group = [{
                orderable: this.orderable
            }];
            this.strategy.orderableGroups = [this.group];
        });

        it('should add a line for the product whatever the label says about a batch', function() {
            var outcome = this.resolve();

            expect(outcome.resolved).toBe(true);
            expect(this.strategy.addLine).toHaveBeenCalledWith(this.group, undefined);
        });

        it('should count the product line that is already there', function() {
            var lineItem = {
                orderable: this.orderable
            };

            this.strategy.lineItems = [lineItem];

            this.resolve();

            expect(this.strategy.addLine).not.toHaveBeenCalled();
            expect(this.strategy.countLine).toHaveBeenCalledWith(lineItem);
        });
    });

    describe('when the batch has no record yet', function() {

        beforeEach(function() {
            this.strategy.allowsNewLot = true;
            this.unknown = {
                gtin: this.scan.gtin,
                lotCode: 'NEWLOT1',
                expirationDate: new Date(2027, 0, 30)
            };
        });

        it('should add a line carrying the scanned code and expiry, without an id', function() {
            var outcome = this.resolve(this.unknown);

            expect(outcome.resolved).toBe(true);
            expect(this.strategy.addLine).toHaveBeenCalledWith(this.group, {
                lotCode: 'NEWLOT1',
                expirationDate: this.unknown.expirationDate
            });
        });

        it('should count up a pending line rather than adding another', function() {
            var pending = {
                orderable: this.orderable,
                lot: {
                    lotCode: 'NEWLOT1'
                }
            };

            this.strategy.lineItems = [pending];

            this.resolve(this.unknown);

            expect(this.strategy.addLine).not.toHaveBeenCalled();
            expect(this.strategy.countLine).toHaveBeenCalledWith(pending);
        });

        it('should match a pending line whatever the case of its code', function() {
            var pending = {
                orderable: this.orderable,
                lot: {
                    lotCode: 'newlot1'
                }
            };

            this.strategy.lineItems = [pending];

            this.resolve(this.unknown);

            expect(this.strategy.countLine).toHaveBeenCalledWith(pending);
        });

        it('should not confuse a pending line with a recorded batch of the same product', function() {
            var recorded = {
                orderable: this.orderable,
                lot: this.lot
            };

            this.strategy.lineItems = [recorded];

            this.resolve(this.unknown);

            expect(this.strategy.countLine).not.toHaveBeenCalledWith(recorded);
            expect(this.strategy.addLine).toHaveBeenCalled();
        });
    });

    describe('acknowledging a scan', function() {

        beforeEach(function() {
            this.strategy.confirm = jasmine.createSpy('confirm').andReturn(this.$q.resolve());
            this.strategy.allowsNewLot = true;
        });

        it('should ask before adding a batch with no record', function() {
            var unknown = {
                gtin: this.scan.gtin,
                lotCode: 'NEWLOT1',
                expirationDate: new Date(2027, 0, 30)
            };

            this.resolve(unknown);

            expect(this.strategy.confirm).toHaveBeenCalled();
            expect(this.strategy.confirm.mostRecentCall.args[0].reason)
                .toEqual(this.CONFIRMATION.NEW_LOT);

            expect(this.strategy.addLine).toHaveBeenCalled();
        });

        it('should ask when the label disagrees with the recorded expiry', function() {
            this.lot.expirationDate = new Date(2028, 2, 31);

            this.resolve({
                gtin: this.scan.gtin,
                lotCode: 'ABC123',
                expirationDate: new Date(2027, 0, 30)
            });

            expect(this.strategy.confirm.mostRecentCall.args[0].reason)
                .toEqual(this.CONFIRMATION.EXPIRY_MISMATCH);

            expect(this.strategy.addLine).toHaveBeenCalled();
        });

        it('should not ask when the label agrees with the recorded expiry', function() {
            this.lot.expirationDate = new Date(2027, 0, 30);

            this.resolve({
                gtin: this.scan.gtin,
                lotCode: 'ABC123',
                expirationDate: new Date(2027, 0, 30)
            });

            expect(this.strategy.confirm).not.toHaveBeenCalled();
        });

        /**
         * A recorded expiry is a Date on a freshly loaded screen and a string once a draft has been
         * through its cache. Both are the same date and must not be reported as a disagreement.
         */
        it('should not ask when the dates agree but are differently shaped', function() {
            this.lot.expirationDate = '2027-01-30T00:00:00.000Z';

            this.resolve({
                gtin: this.scan.gtin,
                lotCode: 'ABC123',
                expirationDate: new Date(2027, 0, 30)
            });

            expect(this.strategy.confirm).not.toHaveBeenCalled();
        });

        it('should not ask when the label carries no expiry', function() {
            this.lot.expirationDate = new Date(2028, 2, 31);

            this.resolve({
                gtin: this.scan.gtin,
                lotCode: 'ABC123'
            });

            expect(this.strategy.confirm).not.toHaveBeenCalled();
        });

        it('should discard the scan when the user declines', function() {
            var outcome;

            this.strategy.confirm.andReturn(this.$q.reject());
            this.lot.expirationDate = new Date(2028, 2, 31);

            outcome = this.resolve({
                gtin: this.scan.gtin,
                lotCode: 'ABC123',
                expirationDate: new Date(2027, 0, 30)
            });

            expect(outcome.rejection).toEqual(this.ERROR.NOT_CONFIRMED);
            expect(this.strategy.addLine).not.toHaveBeenCalled();
            expect(this.strategy.countLine).not.toHaveBeenCalled();
        });

        it('should word a declined scan through the screen\'s messages', function() {
            var outcome;

            this.strategy.confirm.andReturn(this.$q.reject());
            this.strategy.messages = {
                NOT_CONFIRMED: 'stockScan.scanDiscarded'
            };
            this.lot.expirationDate = new Date(2028, 2, 31);

            outcome = this.resolve({
                gtin: this.scan.gtin,
                lotCode: 'ABC123',
                expirationDate: new Date(2027, 0, 30)
            });

            expect(outcome.rejection.messageKey).toEqual('stockScan.scanDiscarded');
        });

        it('should apply the scan when the screen asks nothing', function() {
            delete this.strategy.confirm;
            this.lot.expirationDate = new Date(2028, 2, 31);

            var outcome = this.resolve({
                gtin: this.scan.gtin,
                lotCode: 'ABC123',
                expirationDate: new Date(2027, 0, 30)
            });

            expect(outcome.resolved).toBe(true);
            expect(this.strategy.addLine).toHaveBeenCalled();
        });
    });

    describe('when a line for the scan already exists', function() {

        beforeEach(function() {
            this.lineItem = {
                orderable: this.orderable,
                lot: this.lot
            };
            this.strategy.lineItems = [this.lineItem];
        });

        it('should count it instead of adding another', function() {
            var outcome = this.resolve();

            expect(outcome.resolved).toBe(true);
            expect(this.strategy.addLine).not.toHaveBeenCalled();
            expect(this.strategy.countLine).toHaveBeenCalledWith(this.lineItem);
        });

        it('should not count a line of the same product but a different batch', function() {
            this.lineItem.lot = {
                id: 'another-lot-id',
                lotCode: 'OTHER'
            };

            this.resolve();

            expect(this.strategy.countLine).not.toHaveBeenCalled();
            expect(this.strategy.addLine).toHaveBeenCalled();
        });
    });

});
