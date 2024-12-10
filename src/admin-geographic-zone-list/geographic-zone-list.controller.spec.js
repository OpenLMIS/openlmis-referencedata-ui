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

describe('GeographicZoneListController', function() {

    beforeEach(function() {
        module('admin-geographic-zone-list', function($provide) {
            $provide.value('featureFlagService', {
                set: function() {},
                get: function() {}
            });
            $provide.value('CATCHMENT_POPULATION_CALC_AUTO_FEATURE_FLAG', false);
        });

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$state = $injector.get('$state');
            this.GeographicZoneDataBuilder = $injector.get('GeographicZoneDataBuilder');
        });

        this.geographicZones = [
            new this.GeographicZoneDataBuilder().build(),
            new this.GeographicZoneDataBuilder().build()
        ];

        this.stateParams = {
            page: 0,
            size: 10,
            parent: this.geographicZones[0].code,
            name: 'geographic-zone-1'
        };

        this.vm = this.$controller('GeographicZoneListController', {
            filteredGeographicZones: [this.geographicZones[0]],
            geographicZones: this.geographicZones,
            $stateParams: this.stateParams
        });
        this.vm.$onInit();

        spyOn(this.$state, 'go').andReturn();
    });

    describe('onInit', function() {

        it('should expose search method', function() {
            expect(angular.isFunction(this.vm.search)).toBe(true);
        });

        it('should expose filtered geographic zones array', function() {
            expect(this.vm.filteredGeographicZones).toEqual([this.geographicZones[0]]);
        });

        it('should expose geographic zones array', function() {
            expect(this.vm.geographicZones).toEqual(this.geographicZones);
        });

        it('should expose name', function() {
            expect(this.vm.name).toEqual(this.stateParams.name);
        });

        it('should expose parent', function() {
            expect(this.vm.parent).toEqual(this.stateParams.parent);
        });
    });

    describe('search', function() {

        it('should set all params', function() {
            this.vm.parent = 'some-zone';
            this.vm.name = 'some-name';

            this.vm.search();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.geographicZones', {
                page: this.stateParams.page,
                size: this.stateParams.size,
                parent: 'some-zone',
                name: 'some-name'
            }, {
                reload: true
            });
        });

        it('should call state go method', function() {
            this.vm.search();

            expect(this.$state.go).toHaveBeenCalled();
        });
    });
});
