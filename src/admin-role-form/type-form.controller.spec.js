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
describe('TypeFormController', function() {

    beforeEach(function() {
        module('admin-role-form');

        this.types = [
            'TYPE_ONE',
            'TYPE_TWO',
            'TYPE_THREE'
        ];

        inject(function($injector) {
            this.$state = $injector.get('$state');

            this.$controller = $injector.get('$controller');
        });

        this.roleId = 'role-id';
        this.vm = this.$controller('TypeFormController', {
            $stateParams: {
                roleId: this.roleId
            },
            types: this.types
        });

        spyOn(this.$state, 'go');
    });

    it('should expose the edited role id', function() {
        expect(this.vm.roleId).toEqual(this.roleId);
    });

    it('selectType should open the role form of the given type for the edited role', function() {
        this.vm.selectType(this.types[1]);

        expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.roles.createUpdate', {
            type: this.types[1],
            roleId: this.roleId
        });
    });

    it('selectType should open the role form of the given type for a new role', function() {
        this.vm = this.$controller('TypeFormController', {
            $stateParams: {},
            types: this.types
        });

        this.vm.selectType(this.types[0]);

        expect(this.$state.go.mostRecentCall.args[1].type).toEqual(this.types[0]);
        expect(this.$state.go.mostRecentCall.args[1].roleId).toBeUndefined();
    });

});
