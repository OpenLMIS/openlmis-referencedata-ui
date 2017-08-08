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

    var $state, $controller, $q, $rootScope, loadingModalService, notificationService, referencedataUserService, authUserService, UserPasswordModal, confirmService,
        vm, user, facilities;

    beforeEach(function() {
        module('admin-user-form', function($provide) {
            referencedataUserService = jasmine.createSpyObj('referencedataUserService', ['saveUser']);
            $provide.service('referencedataUserService', function() {
                return referencedataUserService;
            });

            authUserService = jasmine.createSpyObj('authUserService', ['saveUser']);
            $provide.service('authUserService', function() {
                return authUserService;
            });

            confirmService = jasmine.createSpyObj('confirmService', ['confirmDestroy']);
            $provide.service('confirmService', function() {
                return confirmService;
            });

            UserPasswordModal = jasmine.createSpy('UserPasswordModalMock');
            $provide.service('UserPasswordModal', function() {
                return UserPasswordModal;
            });
        });

        inject(function($injector) {
            $state = $injector.get('$state');
            $controller = $injector.get('$controller');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            loadingModalService = $injector.get('loadingModalService');
            notificationService = $injector.get('notificationService');
        });

        spyOn($state, 'go');
        spyOn(loadingModalService, 'open').andReturn($q.when(true));
        spyOn(loadingModalService, 'close').andReturn();
        spyOn(notificationService, 'success').andReturn();

        facilities = [
            {
                code: 'facility-code-1',
                name: 'facility-1'
            },
            {
                code: 'facility-code-2',
                name: 'facility-2'
            }
        ];
        user = {
            id: 'user-id',
            username: 'random-user',
            homeFacility: facilities[0],
            roleAssignments: [
                {
                    roleId: 'role-id-1',
                    programCode: 'program-code-1'
                },
                {
                    roleId: 'role-id-2',
                    warehouseCode: 'warehouse-code-1'
                }
            ]
        };

        vm = $controller('UserFormController', {
            user: user,
            facilities: facilities
        });
        vm.$onInit();
    });

    describe('init', function() {

        it('should expose saveUser method', function() {
            expect(angular.isFunction(vm.saveUser)).toBe(true);
        });

        it('should expose removeHomeFacility method', function() {
            expect(angular.isFunction(vm.removeHomeFacility)).toBe(true);
        });

        it('should set user', function() {
            expect(vm.user).toBe(user);
        });

        it('should set notification', function() {
            expect(vm.notification).toBe('adminUserForm.userUpdatedSuccessfully');
        });

        it('should set updateMode', function() {
            expect(vm.updateMode).toBe(true);
        });

        it('should set updateMode if there is no user passed to controller', function() {
            vm = $controller('UserFormController', {
                user: undefined,
                facilities: facilities
            });
            vm.$onInit();

            expect(vm.updateMode).toBe(false);
            expect(vm.user.loginRestricted).toBe(false);
            expect(vm.notification).toBe('adminUserForm.userCreatedSuccessfully');
        });
    });

    describe('update user', function() {

        var deferred;

        beforeEach(function() {
            deferred = $q.defer();
            referencedataUserService.saveUser.andReturn($q.when(user));
            authUserService.saveUser.andReturn(deferred.promise);

        });

        it('should open loading modal', function() {
            vm.saveUser();
            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should call referencedataUserService', function() {
            vm.saveUser();
            expect(referencedataUserService.saveUser).toHaveBeenCalledWith(user);
        });

        it('should call referencedataUserService with changes', function() {
            vm.user.username = 'newUserName';
            user.username = 'newUserName';

            vm.saveUser();
            expect(referencedataUserService.saveUser).toHaveBeenCalledWith(user);
        });

        it('should call authUserService with changes', function() {
            vm.user.username = 'newUserName';
            user.username = 'newUserName';
            var authUser = {
                enabled: true,
                referenceDataUserId: user.id,
                role: 'USER',
                username: user.username
            };

            vm.saveUser();
            $rootScope.$apply();

            expect(authUserService.saveUser).toHaveBeenCalledWith(authUser);
        });

        it('should show notification', function() {
            deferred.resolve();
            vm.saveUser();
            $rootScope.$apply();

            expect(notificationService.success).toHaveBeenCalledWith(vm.notification);
        });

        it('should redirect to parent state', function() {
            deferred.resolve();
            vm.saveUser();
            $rootScope.$apply();

            expect($state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });

        it('should close loading modal', function() {
            deferred.resolve();
            vm.saveUser();
            $rootScope.$apply();
            expect(loadingModalService.close).toHaveBeenCalled();
        });

        it('should not show notification if request fails', function() {
            deferred.reject();
            vm.saveUser();
            $rootScope.$apply();
            expect(loadingModalService.close).toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
        });
    });

    describe('update user with home facility', function() {

        it('should show confirmation for removing user home facility roles if home facility changed', function() {
            vm.user.homeFacility = null;
            var expectedMessage = {
                'messageKey': 'adminUserForm.removeHomeFacility.confirmation',
                'messageParams': {
                    'facility': vm.initialHomeFacility.name,
                    'username': vm.user.username
                }
            };

            confirmService.confirmDestroy.andReturn($q.when(true));
            vm.saveUser();
            $rootScope.$apply();

            expect(confirmService.confirmDestroy).toHaveBeenCalledWith(
                expectedMessage,
                'adminUserForm.removeHomeFacility.removeRoles',
                'adminUserForm.removeHomeFacility.keepRoles'
            );
        });

        it('should keep user facility rights if user choose to keep them', function() {
            var deferred = $q.defer();

            vm.user.homeFacility = null;

            confirmService.confirmDestroy.andReturn(deferred.promise);
            deferred.reject();

            vm.saveUser();
            $rootScope.$apply();

            expect(referencedataUserService.saveUser).toHaveBeenCalledWith(vm.user);
            expect(vm.user.roleAssignments.length).toBe(2);
        });

        it('should not keep user facility rights if user choose to remove them', function() {
            var confirmDeferred = $q.defer(),
                saveDeferred = $q.defer();

            vm.user.homeFacility = null;

            confirmService.confirmDestroy.andReturn(confirmDeferred.promise);
            confirmDeferred.resolve();

            referencedataUserService.saveUser.andReturn($q.when(user));
            authUserService.saveUser.andReturn(saveDeferred.promise);
            saveDeferred.resolve();

            vm.saveUser();
            $rootScope.$apply();

            expect(referencedataUserService.saveUser).toHaveBeenCalledWith(vm.user);
            expect(vm.user.roleAssignments.length).toBe(1);
        });

    });

    describe('create user', function() {

        beforeEach(function() {
            referencedataUserService.saveUser.andReturn($q.when(user));
            authUserService.saveUser.andReturn($q.when(user));
            UserPasswordModal.andReturn($q.when(user));

            vm = $controller('UserFormController', {
                user: undefined,
                facilities: facilities
            });
            vm.$onInit();
        });

        it('should open loading modal', function() {
            vm.saveUser();
            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should call referencedataUserService', function() {
            vm.saveUser();
            expect(referencedataUserService.saveUser).toHaveBeenCalled();
        });

        it('should call referencedataUserService with changes', function() {
            vm.user.username = 'newUserName';
            vm.saveUser();
            expect(referencedataUserService.saveUser).toHaveBeenCalledWith(vm.user);
        });

        it('should call authUserService', function() {
            vm.saveUser();
            $rootScope.$apply();

            expect(authUserService.saveUser).toHaveBeenCalledWith({
                enabled: true,
                referenceDataUserId: user.id,
                role: 'USER',
                username: user.username
            });
        });

        it('should call UserPasswordModal', function() {
            vm.saveUser();
            $rootScope.$apply();

            expect(UserPasswordModal).toHaveBeenCalledWith(user.username);
        });

        it('should change email if it is empty string', function() {
            vm.saveUser();
            $rootScope.$apply();

            expect($state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });

        it('should call notificationService', function() {
            vm.saveUser();
            $rootScope.$apply();
            expect(notificationService.success).toHaveBeenCalledWith(vm.notification);
        });

        it('should close loading modal', function() {
            vm.saveUser();
            $rootScope.$apply();
            expect(loadingModalService.close).toHaveBeenCalled();
        });
    });

    describe('removeHomeFacility', function() {

        beforeEach(function() {
            confirmService.confirmDestroy.andReturn($q.when(true));
            vm.removeHomeFacility();
            $rootScope.$apply();
        });

        it('should show confirm modal', function() {
            expect(confirmService.confirmDestroy).toHaveBeenCalledWith('adminUserForm.removeHomeFacility.question', 'adminUserForm.removeHomeFacility.label');
        });

        it('should remove home facility from user json', function() {
            expect(vm.user.homeFacility).toBe(undefined);
        });

        it('should remove home facility role assignments', function() {
            expect(vm.user.roleAssignments.length).toBe(1);
            expect(vm.user.roleAssignments[0].programCode).toBe(undefined);
        });
    });
});
