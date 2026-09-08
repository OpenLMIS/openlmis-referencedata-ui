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

describe('openlmis-gtin-scan-input component', function() {

    beforeEach(function() {
        var $compile, $rootScope, tradeItemService, mode, $q;

        module('openlmis-gtin-scan-input');

        inject(function($injector) {
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
            tradeItemService = $injector.get('tradeItemService');
            mode = $injector.get('GS1_SCAN_MODE');
            $q = $injector.get('$q');
        });

        this.$rootScope = $rootScope;
        this.$q = $q;
        this.MODE = mode;
        this.tradeItem = {
            id: 'trade-item-id'
        };
        this.getByGtin = spyOn(tradeItemService, 'getByGtin').andReturn($q.resolve(this.tradeItem));

        this.scope = $rootScope.$new();
        this.scope.mode = mode.RECEIVE;
        this.scope.context = {
            rows: []
        };
        this.scope.onScan = jasmine.createSpy('onScan');

        this.compile = function() {
            this.element = $compile(
                '<openlmis-gtin-scan-input mode="{{mode}}" context="context"'
                + ' on-scan="onScan(scan, tradeItem, mode, context)"></openlmis-gtin-scan-input>'
            )(this.scope);
            this.scope.$apply();

            return this.element;
        };

        /** The scan input this component wraps, as the template wired it up. */
        this.inner = function() {
            return angular.element(this.element[0].querySelector('openlmis-scan-input'))
                .controller('openlmisScanInput');
        };
    });

    afterEach(function() {
        if (this.scope) {
            this.scope.$destroy();
        }
    });

    it('should render the scan input it wraps', function() {
        this.compile();

        expect(this.element[0].querySelectorAll('.openlmis-scan-input').length).toEqual(1);
    });

    it('should pass the mode down to it', function() {
        this.compile();

        expect(this.inner().mode).toEqual(this.MODE.RECEIVE);
    });

    it('should pass the screen\'s context down to it', function() {
        this.compile();

        expect(this.inner().context).toBe(this.scope.context);
    });

    /**
     * The template's own wiring: what the scan input reports has to arrive at the lookup, and the
     * mode and context the handler receives come from the bindings rather than a round trip.
     */
    it('should look the scan up and hand the trade item to the screen', function() {
        var scan = {
            gtin: '05890123456786',
            lotCode: 'ABC123'
        };

        this.compile();
        this.inner().onScan({
            scan: scan
        });
        this.$rootScope.$apply();

        expect(this.getByGtin).toHaveBeenCalledWith(scan.gtin);
        expect(this.scope.onScan).toHaveBeenCalledWith(scan, this.tradeItem, this.MODE.RECEIVE,
            this.scope.context);
    });

    it('should refuse a scan carrying no product code without looking anything up', function() {
        var outcome = {};

        this.compile();
        this.inner()
            .onScan({
                scan: {}
            })
            .catch(function(rejection) {
                outcome.rejection = rejection;
            });
        this.$rootScope.$apply();

        expect(outcome.rejection).toEqual('openlmisGtinScanInput.noGtin');
        expect(this.getByGtin).not.toHaveBeenCalled();
    });

    it('should refuse a malformed scan rather than throwing', function() {
        var context = this,
            outcome = {};

        this.compile();

        expect(function() {
            context.inner()
                .onScan({
                    scan: undefined
                })
                .catch(function(rejection) {
                    outcome.rejection = rejection;
                });
            context.$rootScope.$apply();
        }).not.toThrow();

        expect(outcome.rejection).toEqual('openlmisGtinScanInput.noGtin');
    });

});
