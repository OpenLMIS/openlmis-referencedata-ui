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

describe('OpenlmisGtinScanInputController', function() {

    var GTIN = '05890123456786';

    beforeEach(function() {
        var $controller, $rootScope, q, tradeItemService;

        module('openlmis-gtin-scan-input');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            q = $injector.get('$q');
            tradeItemService = $injector.get('tradeItemService');
        });

        this.$rootScope = $rootScope;
        this.$q = q;

        this.tradeItem = {
            id: 'trade-item-id'
        };
        this.scan = {
            gtin: GTIN,
            lotCode: 'ABC123'
        };
        this.context = {
            rows: []
        };

        this.getByGtin = spyOn(tradeItemService, 'getByGtin');
        this.onScan = jasmine.createSpy('onScan');

        this.vm = $controller('OpenlmisGtinScanInputController', {});
        this.vm.mode = 'RECEIVE';
        this.vm.context = this.context;
        this.vm.onScan = this.onScan;

        this.resolve = function(scan) {
            var outcome = {};

            this.vm.resolve(scan || this.scan, this.vm.mode, this.vm.context)
                .then(function(value) {
                    outcome.resolved = true;
                    outcome.value = value;
                }, function(rejection) {
                    outcome.rejection = rejection;
                });
            this.$rootScope.$apply();

            return outcome;
        };
    });

    it('should look the scanned gtin up', function() {
        this.getByGtin.andReturn(this.$q.resolve(this.tradeItem));

        this.resolve();

        expect(this.getByGtin).toHaveBeenCalledWith(GTIN);
    });

    it('should report the scan and its trade item to the handler', function() {
        this.getByGtin.andReturn(this.$q.resolve(this.tradeItem));

        this.resolve();

        expect(this.onScan).toHaveBeenCalledWith({
            scan: this.scan,
            tradeItem: this.tradeItem,
            mode: 'RECEIVE',
            context: this.context
        });
    });

    it('should resolve when the handler returns nothing', function() {
        this.getByGtin.andReturn(this.$q.resolve(this.tradeItem));

        var outcome = this.resolve();

        expect(outcome.resolved).toBe(true);
    });

    it('should reject when no product is registered with the gtin', function() {
        this.getByGtin.andReturn(this.$q.resolve(undefined));

        var outcome = this.resolve();

        expect(outcome.rejection).toEqual('openlmisGtinScanInput.gtinNotRegistered');
        expect(this.onScan).not.toHaveBeenCalled();
    });

    it('should reject when the lookup fails', function() {
        this.getByGtin.andReturn(this.$q.reject({
            status: 500
        }));

        var outcome = this.resolve();

        expect(outcome.rejection).toEqual('openlmisGtinScanInput.gtinLookupFailed');
        expect(this.onScan).not.toHaveBeenCalled();
    });

    it('should reject without looking up when the scan carries no gtin', function() {
        var outcome = this.resolve({
            lotCode: 'ABC123'
        });

        expect(outcome.rejection).toEqual('openlmisGtinScanInput.noGtin');
        expect(this.getByGtin).not.toHaveBeenCalled();
    });

    it('should pass a rejection from the handler through unchanged', function() {
        this.getByGtin.andReturn(this.$q.resolve(this.tradeItem));
        this.onScan.andReturn(this.$q.reject('stockIssueCreation.productNotOnScreen'));

        var outcome = this.resolve();

        expect(outcome.rejection).toEqual('stockIssueCreation.productNotOnScreen');
    });

    it('should resolve once a promise from the handler resolves', function() {
        this.getByGtin.andReturn(this.$q.resolve(this.tradeItem));
        this.onScan.andReturn(this.$q.resolve('done'));

        var outcome = this.resolve();

        expect(outcome.resolved).toBe(true);
        expect(outcome.value).toEqual('done');
    });

});
