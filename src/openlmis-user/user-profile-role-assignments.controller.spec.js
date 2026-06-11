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

describe('UserProfileRoleAssignmentsController', function() {

    beforeEach(function() {
        module('openlmis-user');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$q = $injector.get('$q');
            this.$state = $injector.get('$state');
            this.ROLE_TYPES = $injector.get('ROLE_TYPES');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
        });

        this.user = new this.UserDataBuilder().build();

        this.vm = this.$controller('UserProfileRoleAssignmentsController', {
            user: this.user
        });
    });

    describe('onInit', function() {

        beforeEach(function() {
            this.vm.$onInit();
        });

        it('should set user profile', function() {
            expect(this.user).toEqual(this.vm.user);
        });

        it('should expose role types', function() {
            expect(this.vm.roleTypes).toEqual(this.ROLE_TYPES.getRoleTypes());
        });

    });

    describe('isRoleTypeActive', function() {

        it('should be active when the role type state is included regardless of page', function() {
            spyOn(this.$state, 'includes').andReturn(true);

            expect(this.vm.isRoleTypeActive(this.ROLE_TYPES.SUPERVISION)).toBe(true);
            expect(this.$state.includes)
                .toHaveBeenCalledWith('openlmis.profile.roleAssignments.' + this.ROLE_TYPES.SUPERVISION);
        });

        it('should not be active when the role type state is not included', function() {
            spyOn(this.$state, 'includes').andReturn(false);

            expect(this.vm.isRoleTypeActive(this.ROLE_TYPES.SUPERVISION)).toBe(false);
        });

    });

});
