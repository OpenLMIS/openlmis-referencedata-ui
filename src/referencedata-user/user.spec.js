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

describe('User', function() {

    beforeEach(function() {
        module('referencedata-user');

        inject(function($injector) {
            this.User = $injector.get('User');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.ROLE_TYPES = $injector.get('ROLE_TYPES');
            this.UserRepository = $injector.get('UserRepository');
        });

        this.userRepository = new this.UserRepository();

        this.json = new this.UserDataBuilder()
            .withSupervisionRoleAssignment('1', '1', '1')
            .withSupervisionRoleAssignment('2', '2', '1')
            .withSupervisionRoleAssignment('3', '1', '2')
            .withOrderFulfillmentRoleAssignment('2', '2')
            .withGeneralAdminRoleAssignment('3')
            .buildJson();

        this.supervisionRoleAssignments = [
            this.json.roleAssignments[0],
            this.json.roleAssignments[1],
            this.json.roleAssignments[2]
        ];

        this.orderFulfillmentRoleAssignment = this.json.roleAssignments[3];
        this.generalAdminRoleAssignment = this.json.roleAssignments[4];

        this.user = new this.User(this.json, this.userRepository);

        spyOn(this.userRepository, 'create');
        spyOn(this.userRepository, 'update');
        spyOn(this.userRepository, 'updateRoleAssignments');
    });

    describe('constructor', function() {

        it('should set all properties', function() {
            expect(this.user.id).toEqual(this.json.id);
            expect(this.user.username).toEqual(this.json.username);
            expect(this.user.firstName).toEqual(this.json.firstName);
            expect(this.user.lastName).toEqual(this.json.lastName);
            expect(this.user.timezone).toEqual(this.json.timezone);
            expect(this.user.email).toEqual(this.json.email);
            expect(this.user.homeFacilityId).toEqual(this.json.homeFacilityId);
            expect(this.user.verified).toEqual(this.json.verified);
            expect(this.user.active).toEqual(this.json.active);
            expect(this.user.allowNotify).toEqual(this.json.allowNotify);
            expect(this.user.extraData).toEqual(this.json.extraData);
            expect(this.user.enabled).toEqual(this.json.enabled);
            expect(this.user.roleAssignments).toEqual(this.json.roleAssignments);
            expect(this.user.repository).toEqual(this.userRepository);
            expect(this.user.isNewUser).toEqual(false);
        });

        it('should return true if user has no id', function() {
            this.user = new this.User();

            expect(this.user.isNewUser).toEqual(true);
        });

    });

    describe('fromJson', function() {

        it('should serialize the user to JSON', function() {
            expect(this.user.toJson()).toEqual(angular.toJson(this.user));
        });

    });

    describe('getRoleAssignments', function() {

        it('should get all role assignments if type is not provided', function() {
            expect(this.user.getRoleAssignments()).toEqual(this.json.roleAssignments);
        });

        it('should get zero role assignments if type is incorrect', function() {
            expect(this.user.getRoleAssignments('abc')).toEqual([]);
        });

        it('should get role assignments by type', function() {
            expect(this.user.getRoleAssignments(this.ROLE_TYPES.SUPERVISION))
                .toEqual(this.supervisionRoleAssignments);

            expect(this.user.getRoleAssignments(this.ROLE_TYPES.ORDER_FULFILLMENT))
                .toEqual([this.orderFulfillmentRoleAssignment]);

            expect(this.user.getRoleAssignments(this.ROLE_TYPES.GENERAL_ADMIN))
                .toEqual([this.generalAdminRoleAssignment]);
        });

        it('should get supervision role assignments by supervisoryNodeId', function() {
            expect(this.user.getRoleAssignments(this.ROLE_TYPES.SUPERVISION, '1')).
                toEqual([this.supervisionRoleAssignments[0], this.supervisionRoleAssignments[2]]);
        });

        it('should get supervision role assignments by supervisoryNodeId and programId', function() {
            expect(this.user.getRoleAssignments(this.ROLE_TYPES.SUPERVISION, '1', '1'))
                .toEqual([this.supervisionRoleAssignments[0]]);
        });

    });

    describe('save', function() {

        it('should update the user if it exists', function() {
            this.user.save();

            expect(this.userRepository.update).toHaveBeenCalledWith(this.user);
            expect(this.userRepository.create).not.toHaveBeenCalled();
        });

        it('should create new user if it does not exist', function() {
            this.user.id = undefined;

            this.user.save();

            expect(this.userRepository.create).toHaveBeenCalledWith(this.user);
            expect(this.userRepository.update).not.toHaveBeenCalled();
        });

        it('should set active flag before sending a request', function() {
            this.user.enabled = false;
            this.user.active = true;

            this.user.save();

            expect(this.user.active).toEqual(this.user.enabled);
        });

    });

    describe('saveRoleAssignments', function() {

        it('should update the role assignments through the repository', function() {
            this.user.saveRoleAssignments();

            expect(this.userRepository.updateRoleAssignments).toHaveBeenCalledWith(this.user);
            expect(this.userRepository.update).not.toHaveBeenCalled();
        });

        it('should leave the active flag as loaded', function() {
            this.user.enabled = false;
            this.user.active = true;

            this.user.saveRoleAssignments();

            expect(this.user.active).toBe(true);
        });

    });

    describe('getBasicInformation', function() {

        it('should return basic information about the user', function() {
            expect(this.user.getBasicInformation()).toEqual({
                id: this.user.id,
                username: this.user.username,
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                jobTitle: this.user.jobTitle,
                timezone: this.user.timezone,
                homeFacilityId: this.user.homeFacilityId,
                active: this.user.active,
                extraData: this.user.extraData,
                roleAssignments: this.user.roleAssignments
            });
        });

    });

    describe('getContactDetails', function() {

        it('should return user contact details', function() {
            expect(this.user.getContactDetails()).toEqual({
                referenceDataUserId: this.user.id,
                phoneNumber: this.user.phoneNumber,
                allowNotify: this.user.allowNotify,
                emailDetails: {
                    emailVerified: this.user.verified,
                    email: this.user.email
                }
            });
        });

    });

    describe('getAuthDetails', function() {

        it('should return user authentication details', function() {
            expect(this.user.getAuthDetails()).toEqual({
                id: this.user.id,
                username: this.user.username,
                enabled: this.user.enabled
            });
        });

    });

    describe('removeHomeFacilityRights', function() {

        it('should remove rights with program id and without supervisory node id', function() {
            this.supervisionRoleAssignments[0].supervisoryNodeId = undefined;
            this.supervisionRoleAssignments[1].supervisoryNodeId = undefined;
            this.supervisionRoleAssignments[2].supervisoryNodeId = undefined;

            this.user.removeHomeFacilityRights();

            expect(this.user.roleAssignments).toEqual([
                this.orderFulfillmentRoleAssignment,
                this.generalAdminRoleAssignment
            ]);
        });

    });

    describe('removeAllRoleAssignments', function() {

        it('should remove every role assignment', function() {
            this.user.removeAllRoleAssignments();

            expect(this.user.roleAssignments).toEqual([]);
        });

        it('should leave an empty list if the user had no role assignments', function() {
            this.user.roleAssignments = undefined;

            this.user.removeAllRoleAssignments();

            expect(this.user.roleAssignments).toEqual([]);
        });

    });

});
