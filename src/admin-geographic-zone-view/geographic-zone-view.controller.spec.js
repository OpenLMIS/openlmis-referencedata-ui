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

describe('GeographicZoneViewController', function() {

    beforeEach(function() {
        module('admin-geographic-zone-view', function($provide) {
            $provide.value('featureFlagService', {
                set: function() {},
                get: function() {}
            });
        });

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.GeographicZoneDataBuilder = $injector.get('GeographicZoneDataBuilder');
        });

        this.geographicZone = new this.GeographicZoneDataBuilder().build();

        this.vm = this.$controller('GeographicZoneViewController', {
            geographicZone: this.geographicZone
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose geographic zone', function() {
            expect(this.vm.geographicZone).toEqual(this.geographicZone);
        });
    });
});
