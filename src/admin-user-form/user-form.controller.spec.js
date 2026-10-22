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

describe('UserFormController', function() {

    beforeEach(function() {
        module('admin-user-form');

        inject(function($injector) {
            this.$state = $injector.get('$state');
            this.$controller = $injector.get('$controller');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.loadingModalService = $injector.get('loadingModalService');
            this.notificationService = $injector.get('notificationService');
            this.VerificationEmailDataBuilder = $injector.get('VerificationEmailDataBuilder');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            this.authUserService = $injector.get('authUserService');
            this.confirmService = $injector.get('confirmService');
        });

        this.facilities = [
            new this.FacilityDataBuilder().build(),
            new this.FacilityDataBuilder().build()
        ];

        this.user = new this.UserDataBuilder()
            .withUsername('random-user')
            .withHomeFacilityId(this.facilities[0].id)
            .build();
        this.user.enabled = true;

        this.pendingVerificationEmail = new this.VerificationEmailDataBuilder().build();

        spyOn(this.$state, 'go');
        spyOn(this.loadingModalService, 'open').andReturn(this.$q.when(true));
        spyOn(this.loadingModalService, 'close').andReturn();
        spyOn(this.notificationService, 'success').andReturn();
        spyOn(this.user, 'removeHomeFacilityRights');
        spyOn(this.user, 'removeAllRoleAssignments');
        spyOn(this.user, 'save').andReturn();
        spyOn(this.authUserService, 'sendVerificationEmail').andReturn();
        spyOn(this.confirmService, 'confirmDestroy').andReturn();

        this.vm = this.$controller('UserFormController', {
            user: this.user,
            facilities: this.facilities,
            pendingVerificationEmail: this.pendingVerificationEmail
        });
    });

    describe('init', function() {

        it('should expose saveUser method', function() {
            this.vm.$onInit();

            expect(angular.isFunction(this.vm.saveUser)).toBe(true);
        });

        it('should set user', function() {
            this.vm.$onInit();

            expect(this.vm.user).toBe(this.user);
        });

        it('should set updateMode', function() {
            this.vm.$onInit();

            expect(this.vm.updateMode).toBe(true);
        });

        it('should set initialUsername', function() {
            this.vm.$onInit();

            expect(this.vm.initialUsername).toBe('random-user');
        });

        it('should set initialEnabled', function() {
            this.vm.$onInit();

            expect(this.vm.initialEnabled).toBe(true);
        });

        it('should set not set updateMode if creating new user', function() {
            this.user.id = undefined;

            this.vm.$onInit();

            expect(this.vm.updateMode).toBe(false);
        });

        it('should set pendingVerificationEmail', function() {
            this.vm.$onInit();

            expect(this.vm.pendingVerificationEmail).toBe(this.pendingVerificationEmail);
        });

        it('should not set home facility if user does not have one', function() {
            this.user.homeFacilityId = undefined;

            this.vm.$onInit();

            expect(this.vm.homeFacility).toBeUndefined();
        });
    });

    describe('saveUser', function() {

        beforeEach(function() {
            this.vm.$onInit();

            this.confirmService.confirmDestroy.andReturn(this.$q.resolve());
        });

        it('should update homeFacilityId', function() {
            this.vm.homeFacility = this.facilities[1];

            this.vm.saveUser();

            expect(this.user.homeFacilityId).toEqual(this.vm.homeFacility.id);
        });

        it('should clear homeFacilityId', function() {
            this.vm.homeFacility = undefined;

            this.vm.saveUser();

            expect(this.user.homeFacilityId).toBeUndefined();
        });

        it('should not ask to clear home facility rights if facility has not changed', function() {
            this.vm.saveUser();

            expect(this.confirmService.confirmDestroy).not.toHaveBeenCalled();
        });

        it('should save user', function() {
            this.vm.saveUser();

            expect(this.user.save).toHaveBeenCalled();
        });

        it('should ask to remove home facility rights if home facility changed', function() {
            this.vm.homeFacility = this.facilities[1];

            this.vm.saveUser();

            expect(this.confirmService.confirmDestroy).toHaveBeenCalled();
        });

        it('should save user with home facility rights after dismissing confirmation modal', function() {
            this.confirmService.confirmDestroy.andReturn(this.$q.reject());
            this.vm.homeFacility = this.facilities[1];

            this.vm.saveUser();
            this.$rootScope.$apply();

            expect(this.user.save).toHaveBeenCalled();
            expect(this.user.removeHomeFacilityRights).not.toHaveBeenCalled();
        });

        it('should remove home facility right after confirmation', function() {
            this.vm.homeFacility = this.facilities[1];

            this.vm.saveUser();
            this.$rootScope.$apply();

            expect(this.user.save).toHaveBeenCalled();
            expect(this.user.removeHomeFacilityRights).toHaveBeenCalled();
        });

        it('should ask to remove roles if the user has been disabled', function() {
            this.vm.user.enabled = false;

            this.vm.saveUser();
            this.$rootScope.$apply();

            expect(this.confirmService.confirmDestroy).toHaveBeenCalledWith({
                messageKey: 'adminUserForm.disableUser.confirmation',
                messageParams: {
                    username: 'random-user'
                }
            }, 'adminUserForm.disableUser.removeRoles', 'adminUserForm.disableUser.keepRoles');
        });

        it('should remove all role assignments and save after confirming', function() {
            this.vm.user.enabled = false;

            this.vm.saveUser();
            this.$rootScope.$apply();

            expect(this.user.removeAllRoleAssignments).toHaveBeenCalled();
            expect(this.user.save).toHaveBeenCalled();
        });

        it('should keep role assignments and save after dismissing the confirmation', function() {
            this.confirmService.confirmDestroy.andReturn(this.$q.reject());
            this.vm.user.enabled = false;

            this.vm.saveUser();
            this.$rootScope.$apply();

            expect(this.user.removeAllRoleAssignments).not.toHaveBeenCalled();
            expect(this.user.save).toHaveBeenCalled();
        });

        it('should not ask to remove roles if the user stays enabled', function() {
            this.vm.saveUser();
            this.$rootScope.$apply();

            expect(this.confirmService.confirmDestroy).not.toHaveBeenCalled();
            expect(this.user.save).toHaveBeenCalled();
        });

        it('should not ask to remove roles if the user was already disabled', function() {
            this.user.enabled = false;
            this.vm.$onInit();

            this.vm.saveUser();
            this.$rootScope.$apply();

            expect(this.confirmService.confirmDestroy).not.toHaveBeenCalled();
            expect(this.user.save).toHaveBeenCalled();
        });

        it('should not ask to remove roles when creating a disabled user', function() {
            this.user.id = undefined;
            this.user.enabled = undefined;
            this.vm.$onInit();
            this.vm.user.enabled = false;

            this.vm.saveUser();
            this.$rootScope.$apply();

            expect(this.confirmService.confirmDestroy).not.toHaveBeenCalled();
            expect(this.user.save).toHaveBeenCalled();
        });

        it('should ask only about disabling if the home facility changed too', function() {
            this.vm.homeFacility = this.facilities[1];
            this.vm.user.enabled = false;

            this.vm.saveUser();
            this.$rootScope.$apply();

            expect(this.confirmService.confirmDestroy.callCount).toBe(1);
            expect(this.confirmService.confirmDestroy.mostRecentCall.args[0].messageKey)
                .toEqual('adminUserForm.disableUser.confirmation');

            expect(this.user.removeAllRoleAssignments).toHaveBeenCalled();
            expect(this.user.removeHomeFacilityRights).not.toHaveBeenCalled();
            expect(this.user.save).toHaveBeenCalled();
        });

    });

    describe('sendVerificationEmail', function() {

        beforeEach(function() {
            this.vm.$onInit();
        });

        it('should send verification email', function() {
            this.authUserService.sendVerificationEmail.andReturn(this.$q.when(true));
            this.vm.sendVerificationEmail();
            this.$rootScope.$apply();

            expect(this.authUserService.sendVerificationEmail).toHaveBeenCalledWith(this.vm.user.id);
            expect(this.notificationService.success)
                .toHaveBeenCalledWith('adminUserForm.sendVerificationEmail.success');
        });

    });

});
