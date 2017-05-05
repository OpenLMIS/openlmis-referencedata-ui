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

describe('FacilityViewController', function () {

    var $state, $controller,
        vm, facility;

    beforeEach(function() {
        module('admin-facility-view');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
        });

        facility = {
            id: 'facility-id',
            name: 'facility-name'
        };

        vm = $controller('FacilityViewController', {
            facility: facility
        });
        vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose goToFacilityList method', function() {
            expect(angular.isFunction(vm.goToFacilityList)).toBe(true);
        });

        it('should expose facility', function() {
            expect(vm.facility).toEqual(facility);
        });
    });

    describe('goToFacilityList', function() {

        beforeEach(function() {
            spyOn($state, 'go').andReturn();
            vm.goToFacilityList();
        });

        it('should call state go with correct params', function() {
            expect($state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });
    });
});