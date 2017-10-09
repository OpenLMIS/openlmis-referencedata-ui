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

describe('openlmis-currency-cache.currencyCacheService', function() {
    var $rootScope, currencyService, $q, $state;

    beforeEach(module('openlmis-currency-cache'));

    beforeEach(inject(function($injector) {
        currencyService = $injector.get('currencyService');
        $rootScope = $injector.get('$rootScope');
        $q = $injector.get('$q');
        $state = $injector.get('$state');

        spyOn(currencyService, 'getCurrencySettings').andReturn($q.resolve());
    }));

    it('gets currency settings at login', function() {
        $rootScope.$emit('openlmis-auth.login');

        expect(currencyService.getCurrencySettings).toHaveBeenCalled();
    });

    it('stops $stateChangeStart while waiting for currency settings', inject(function($q, $urlRouter) {
        var deferred = $q.defer();
        currencyService.getCurrencySettings.andReturn(deferred.promise);

        spyOn($state, 'go').andCallThrough();

        $rootScope.$emit('openlmis-auth.login');
        var event = $rootScope.$emit('$stateChangeStart', 'exampleState');
        $rootScope.$apply();
        
        expect(event.defaultPrevented).toBe(true);

        deferred.resolve();
        $rootScope.$apply();

        expect($state.go).toHaveBeenCalled();
    }));

});
