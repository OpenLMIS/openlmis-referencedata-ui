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

describe('referencedataRoleService', function() {

    beforeEach(function() {
        module('referencedata-role');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.referencedataRoleFactory = $injector.get('referencedataRoleFactory');
            this.referencedataRoleService = $injector.get('referencedataRoleService');
            this.RoleDataBuilder = $injector.get('RoleDataBuilder');
            this.RightDataBuilder = $injector.get('RightDataBuilder');
        });

        this.roles = [
            new this.RoleDataBuilder()
                .withRight(new this.RightDataBuilder().build())
                .build(),
            new this.RoleDataBuilder()
                .withRight(new this.RightDataBuilder().build())
                .build()
        ];

        spyOn(this.referencedataRoleService, 'getAll').andReturn(this.$q.when(this.roles));
        spyOn(console, 'error');
    });

    describe('getAllWithType', function() {

        it('should set types property for all roles', function() {
            var result;
            this.referencedataRoleFactory
                .getAllWithType()
                .then(function(roles) {
                    result = roles;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.roles);
            angular.forEach(result, function(role) {
                expect(role.type).toEqual(role.rights[0].type);
            });
        });

        it('should leave the type undefined for a role without rights and still type the others', function() {
            var roleWithoutRights = new this.RoleDataBuilder().build(),
                lastRole = new this.RoleDataBuilder()
                    .withRight(new this.RightDataBuilder().build())
                    .build(),
                result,
                rejection;

            this.referencedataRoleService.getAll.andReturn(this.$q.when([
                this.roles[0],
                roleWithoutRights,
                lastRole
            ]));

            this.referencedataRoleFactory
                .getAllWithType()
                .then(function(roles) {
                    result = roles;
                })
                .catch(function(error) {
                    rejection = error;
                });
            this.$rootScope.$apply();

            expect(rejection).toBeUndefined();
            expect(result.length).toEqual(3);
            expect(result[0].type).toEqual(this.roles[0].rights[0].type);
            expect(result[1].type).toBeUndefined();
            expect(result[2].type).toEqual(lastRole.rights[0].type);
        });

        it('should resolve and not reject if all roles have no rights', function() {
            var result, rejection;

            this.referencedataRoleService.getAll.andReturn(this.$q.when([
                new this.RoleDataBuilder().build()
            ]));

            this.referencedataRoleFactory
                .getAllWithType()
                .then(function(roles) {
                    result = roles;
                })
                .catch(function(error) {
                    rejection = error;
                });
            this.$rootScope.$apply();

            expect(rejection).toBeUndefined();
            expect(result.length).toEqual(1);
        });
    });
});
