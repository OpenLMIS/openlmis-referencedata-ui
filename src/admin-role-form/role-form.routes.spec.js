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

describe('openlmis.administration.roles state', function() {

    beforeEach(function() {
        module('openlmis-admin');
        module('admin-role-list');
        module('admin-role-form');

        inject(function($injector) {
            this.$state = $injector.get('$state');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.referencedataRightService = $injector.get('referencedataRightService');
            this.RoleDataBuilder = $injector.get('RoleDataBuilder');
            this.RightDataBuilder = $injector.get('RightDataBuilder');
            this.roleTypeService = $injector.get('roleTypeService');
        });

        this.role =  new this.RoleDataBuilder()
            .withRight(new this.RightDataBuilder().withName('right1')
                .build())
            .build();

        this.rights = [
            new this.RightDataBuilder().withName('right1')
                .build(),
            new this.RightDataBuilder().withName('right2')
                .build()
        ];

        this.type = 'type';

        spyOn(console, 'error');
        spyOn(this.referencedataRightService, 'search').andReturn(this.$q.when(this.rights));

        this.state = this.$state.get('openlmis.administration.roles.createUpdate');
    });

    it('should set `checked` property to false if right is not in role', function() {
        var result;

        this.state.resolve.rights(this.$q, this.role, this.type, this.referencedataRightService).then(function(right) {
            result = right;
        });

        this.$rootScope.$apply();

        expect(result[0].checked).toEqual(true);
        expect(result[1].checked).toEqual(false);

    });

    describe('type resolve', function() {

        it('should return the type of the role', function() {
            expect(this.state.resolve.type(this.role, this.$state, {}, this.roleTypeService))
                .toEqual(this.role.rights[0].type);
        });

        it('should return undefined for a role with no rights', function() {
            var roleWithoutRights = new this.RoleDataBuilder().build();

            expect(this.state.resolve.type(roleWithoutRights, this.$state, {}, this.roleTypeService)).toBeUndefined();
        });
    });

});
