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

describe('RoleListController', function() {

    beforeEach(function() {
        module('admin-role-list');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.messageService = $injector.get('messageService');
            this.RoleDataBuilder = $injector.get('RoleDataBuilder');
            this.ROLE_TYPES = $injector.get('ROLE_TYPES');
        });

        spyOn(console, 'error');
        spyOn(this.messageService, 'get').andCallFake(function(key) {
            return 'translated:' + key;
        });

        this.rolesList = [
            new this.RoleDataBuilder().build(),
            new this.RoleDataBuilder().build()
        ];

        this.vm = this.$controller('RoleListController', {
            roles: this.rolesList
        });
    });

    describe('init', function() {
        it('should expose roles property', function() {
            expect(this.vm.roles).toBe(this.rolesList);
        });

        it('should set roles page as undefined', function() {
            expect(this.vm.rolesPage).toBe(undefined);
        });

    });

    describe('roleTypeLabels', function() {

        it('should translate the type of a role that has rights', function() {
            var role = new this.RoleDataBuilder()
                .withRight({
                    type: this.ROLE_TYPES.SUPERVISION
                })
                .build();

            this.vm = this.$controller('RoleListController', {
                roles: [role]
            });

            expect(this.vm.roleTypeLabels[role.id]).toEqual('translated:referencedataRoles.supervision');
        });

        it('should use the placeholder for a role with no rights', function() {
            var role = new this.RoleDataBuilder().build();

            this.vm = this.$controller('RoleListController', {
                roles: [role]
            });

            expect(this.vm.roleTypeLabels[role.id]).toEqual('translated:adminRoleList.notApplicable');
        });

        it('should label every role, whether or not it has rights', function() {
            var withRights = new this.RoleDataBuilder()
                    .withRight({
                        type: this.ROLE_TYPES.REPORTS
                    })
                    .build(),
                withoutRights = new this.RoleDataBuilder().build();

            this.vm = this.$controller('RoleListController', {
                roles: [withoutRights, withRights]
            });

            expect(this.vm.roleTypeLabels[withoutRights.id]).toEqual('translated:adminRoleList.notApplicable');
            expect(this.vm.roleTypeLabels[withRights.id]).toEqual('translated:referencedataRoles.reports');
        });
    });
});
