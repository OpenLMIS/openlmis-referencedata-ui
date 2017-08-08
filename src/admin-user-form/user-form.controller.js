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

(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name admin-user-form.controller:UserFormController
     *
     * @description
     * Exposes method for creating/updating user to the modal view.
     */
    angular
        .module('admin-user-form')
        .controller('UserFormController', controller);

        controller.$inject = [
            'user', 'facilities', 'referencedataUserService', 'loadingModalService', 'confirmService',
            '$filter', '$state', 'notificationService', 'UserPasswordModal', 'authUserService'
        ];

        function controller(user, facilities, referencedataUserService, loadingModalService, confirmService,
                            $filter, $state, notificationService, UserPasswordModal, authUserService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.saveUser = saveUser;
        vm.removeHomeFacility = removeHomeFacility;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserFormController
         * @name user
         * @type {Object}
         *
         * @description
         * User object to be created/updated.
         */
        vm.user = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserFormController
         * @name facilities
         * @type {Array}
         *
         * @description
         * List of all possible facilities.
         */
        vm.facilities = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserFormController
         * @name updateMode
         * @type {Boolean}
         *
         * @description
         * True if screen is in user update mode, false when create mode.
         */
        vm.updateMode = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserFormController
         * @name user
         * @type {String}
         *
         * @description
         * Message to be displayed when user is created/updated successfully.
         */
        vm.notification = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-user-form.controller:UserFormController
         * @name initialHomeFacility
         * @type {String}
         *
         * @description
         * Initial home facility of user, used to determine it's change.
         */
        vm.initialHomeFacility = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserFormController
         * @name $onInit
         *
         * @description
         * Initialization method of the UserFormModalController.
         */
        function onInit() {
            vm.updateMode = !!user;
            vm.user = user ? user : {
                loginRestricted: false
            };

            vm.initialHomeFacility = user ? user.homeFacility : undefined;
            vm.notification = 'adminUserForm.user' + (vm.updateMode ? 'Updated' : 'Created') + 'Successfully';
            vm.facilities = facilities;
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserFormController
         * @name saveUser
         *
         * @description
         * Creates or updates the user. If home facility has changed, a confirmation modal
         * is shown for deleting user's roles for old home facility, and deletes them if accepted.
         *
         * @return {Promise} the promise resolving to the created/updated user
         */
        function saveUser() {
            if (vm.updateMode) {
                if (vm.initialHomeFacility && vm.initialHomeFacility != user.homeFacility) {
                    return removeHomeFacilityRightsConfirmation().then(function() {
                        return processUpdateUser(true);
                    }, function() {
                        return processUpdateUser(false);
                    });
                } else {
                    return processUpdateUser(false);
                }
            } else {
                return processCreateUser();
            }
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserFormController
         * @name saveUserData
         *
         * @description
         * Updates the user data.
         *
         * @return {Promise} the promise resolving to the updated user
         */
        function saveUserData() {
            return referencedataUserService.saveUser(vm.user);
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserFormController
         * @name processUpdateUser
         *
         * @description
         * Processes the user update workflow, along with displaying the loading modal.
         *
         * @param  {Boolean} removeFacilityRights indicates if user home facility rights should be removed
         * @return {Promise} the promise resolving on the process completed
         */
        function processUpdateUser(removeFacilityRights) {
            var loadingPromise = loadingModalService.open(true);
            var savePromise = createUser();

            if (removeFacilityRights) {
                savePromise = savePromise.then(function() {
                    vm.user.roleAssignments = $filter('userRoleAssignments')(vm.user.roleAssignments);
                    return createUser();
                });
            }

            return savePromise.then(function() {
                loadingPromise.then(function () {
                    notificationService.success(vm.notification);
                });
                goToUserList();
            }).finally(loadingModalService.close);
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserFormController
         * @name processCreateUser
         *
         * @description
         * Processes the user creation workflow, along with displaying the loading modal.
         *
         * @return {Promise} the promise resolving on the process completed
         */
        function processCreateUser() {
            var loadingPromise = loadingModalService.open(true);
            return createUser().then(function(savedUser) {
                loadingPromise.then(function () {
                    notificationService.success(vm.notification);
                });

                (new UserPasswordModal(savedUser.username)).finally(function () {
                    goToUserList();
                });
            }, loadingModalService.close)
            .finally(loadingModalService.close);
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserFormController
         * @name createUser
         *
         * @description
         * Saves user data in both reference-data and auth services.
         *
         * @return {Promise} the promise resolving to the updated user
         */
        function createUser() {
            return saveUserData().then(function(savedUser) {
                return authUserService.saveUser({
                    enabled: true,
                    referenceDataUserId: savedUser.id,
                    role: 'USER',
                    username: savedUser.username
                });
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserFormController
         * @name removeHomeFacilityRightsConfirmation
         *
         * @description
         * Displays a confirmation modal for removing user home facility rights.
         *
         * @return {Promise} the promise resolving on confirmation modal action.
         */
        function removeHomeFacilityRightsConfirmation() {
            var message = {
                'messageKey': 'adminUserForm.removeHomeFacility.confirmation',
                'messageParams': {
                    'facility': vm.initialHomeFacility.name,
                    'username': vm.user.username
                }
            }

            return confirmService.confirmDestroy(
                message,
                'adminUserForm.removeHomeFacility.removeRoles',
                'adminUserForm.removeHomeFacility.keepRoles'
            );
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.controller:UserFormController
         * @name removeHomeFacility
         *
         * @description
         * Displays confirm modal for deleting home facility.
         * After confirmation removes home facility and all role assignments for home facility.
         */
        function removeHomeFacility() {
            confirmService.confirmDestroy('adminUserForm.removeHomeFacility.question', 'adminUserForm.removeHomeFacility.label').then(function() {
                vm.user.homeFacility = undefined;
                vm.user.roleAssignments = $filter('userRoleAssignments')(vm.user.roleAssignments);
            });
        }

        function goToUserList() {
            $state.go('^', {}, {
                reload: true
            });
        }
    }
})();
