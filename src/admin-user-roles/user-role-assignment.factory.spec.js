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

describe('userRoleAssignmentFactory', function() {

    beforeEach(function() {
        module('admin-user-roles');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.UserRepository = $injector.get('UserRepository');
            this.userRoleAssignmentFactory = $injector.get('userRoleAssignmentFactory');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.RoleDataBuilder = $injector.get('RoleDataBuilder');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            this.FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            this.SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
        });

        this.supervisoryNodes = [
            new this.SupervisoryNodeDataBuilder()
                .withName('Supervisory Node')
                .withFacility(
                    new this.FacilityDataBuilder()
                        .withName('Facility')
                        .build()
                )
                .build(),
            new this.SupervisoryNodeDataBuilder().build()
        ];
        this.warehouses = [
            new this.FacilityDataBuilder().build(),
            new this.FacilityDataBuilder().build()
        ];
        this.programs = [
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build()
        ];
        this.roles = [
            new this.RoleDataBuilder()
                .withSupervisionType()
                .withRight({
                    type: 'type-1'
                })
                .build(),
            new this.RoleDataBuilder()
                .withGeneralAdminType()
                .withRight({
                    type: 'type-2'
                })
                .build(),
            new this.RoleDataBuilder()
                .withOrderFulfillmentType()
                .withRight({
                    type: 'type-3'
                })
                .build()
        ];

        this.user = new this.UserDataBuilder()
            .withSupervisionRoleAssignment(this.roles[0].id, this.supervisoryNodes[0].id, this.programs[0].id)
            .withGeneralAdminRoleAssignment(this.roles[1].id)
            .withOrderFulfillmentRoleAssignment(this.roles[2].id, this.warehouses[0].id)
            .build();

        spyOn(this.UserRepository.prototype, 'get');
    });

    describe('getUser', function() {

        var resultUser;

        beforeEach(function() {
            this.UserRepository.prototype.get.andReturn(this.$q.resolve(this.user));
            this.userRoleAssignmentFactory
                .getUser(this.user.id, this.roles, this.programs, this.supervisoryNodes, this.warehouses)
                .then(function(response) {
                    resultUser = response;
                });
            this.$rootScope.$apply();
        });

        it('should expose addInfoToRoleAssignments method', function() {
            expect(angular.isFunction(this.userRoleAssignmentFactory.getUser)).toBe(true);
        });

        it('should call referencedataUserService', function() {
            expect(this.UserRepository.prototype.get).toHaveBeenCalledWith(this.user.id);
        });

        it('should set type properties for all assignments', function() {
            expect(resultUser.roleAssignments[0].type).toEqual(this.roles[0].rights[0].type);
            expect(resultUser.roleAssignments[1].type).toEqual(this.roles[1].rights[0].type);
            expect(resultUser.roleAssignments[2].type).toEqual(this.roles[2].rights[0].type);
        });

        it('should set role name properties for all assignments', function() {
            expect(resultUser.roleAssignments[0].roleName).toEqual(this.roles[0].name);
            expect(resultUser.roleAssignments[1].roleName).toEqual(this.roles[1].name);
            expect(resultUser.roleAssignments[2].roleName).toEqual(this.roles[2].name);
        });

        it('should set program name properties for all assignments', function() {
            expect(resultUser.roleAssignments[0].programName).toEqual(this.programs[0].name);
        });

        it('should set supervisory node name properties for all assignments', function() {
            expect(resultUser.roleAssignments[0].supervisoryNodeName).toEqual('Supervisory Node (Facility)');
        });

        it('should set warehouse name properties for all assignments', function() {
            expect(resultUser.roleAssignments[2].warehouseName).toEqual(this.warehouses[0].name);
        });
    });

    describe('getUser for a role without rights', function() {

        beforeEach(function() {
            spyOn(console, 'error');

            this.roleWithoutRights = new this.RoleDataBuilder().build();
            this.userWithRoleWithoutRights = new this.UserDataBuilder()
                .withGeneralAdminRoleAssignment(this.roleWithoutRights.id)
                .build();

            this.UserRepository.prototype.get.andReturn(this.$q.resolve(this.userWithRoleWithoutRights));
        });

        it('should keep the assignment and leave its type undefined', function() {
            var result;

            this.userRoleAssignmentFactory
                .getUser(this.userWithRoleWithoutRights.id, [this.roleWithoutRights], this.programs,
                    this.supervisoryNodes, this.warehouses)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();

            expect(result.roleAssignments.length).toEqual(1);
            expect(result.roleAssignments[0].roleName).toEqual(this.roleWithoutRights.name);
            expect(result.roleAssignments[0].type).toBeUndefined();
        });

        it('should keep the assignment if its role is not in the given list', function() {
            var result;

            this.userRoleAssignmentFactory
                .getUser(this.userWithRoleWithoutRights.id, [], this.programs,
                    this.supervisoryNodes, this.warehouses)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();

            expect(result.roleAssignments.length).toEqual(1);
            expect(result.roleAssignments[0].roleId).toEqual(this.roleWithoutRights.id);
            expect(result.roleAssignments[0].roleName).toBeUndefined();
            expect(result.roleAssignments[0].type).toBeUndefined();
        });
    });
});
