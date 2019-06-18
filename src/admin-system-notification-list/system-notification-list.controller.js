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
     * @name admin-system-notification-list.controller:SystemNotificationListController
     *
     * @description
     * Controller for managing system notifications list screen.
     */
    angular
        .module('admin-system-notification-list')
        .controller('SystemNotificationListController', controller);

    controller.$inject = ['systemNotifications', 'usersMap', 'users', '$stateParams', '$state'];

    function controller(systemNotifications, usersMap, users, $stateParams, $state) {

        var vm = this;

        vm.$onInit = onInit;
        vm.loadSystemNotifications = loadSystemNotifications;

        /**
         * @ngdoc property
         * @propertyOf admin-system-notification-list.controller:SystemNotificationListController
         * @name systemNotifications
         * @type {Array}
         *
         * @description
         * Contains filtered system notifications.
         */
        vm.systemNotifications = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-system-notification-list.controller:SystemNotificationListController
         * @name usersMap
         * @type {Object}
         *
         * @description
         * Map of users that are authors of the notifications.
         */
        vm.usersMap = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-system-notification-list.controller:SystemNotificationListController
         * @name users
         * @type {Array}
         *
         * @description
         * List of users that are authors of the notifications.
         */
        vm.users = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-system-notification-list.controller:SystemNotificationListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating SystemNotificationListController.
         */
        function onInit() {
            vm.systemNotifications = systemNotifications;
            vm.usersMap = usersMap;
            vm.users = users;
            vm.isDisplayed = $stateParams.isDisplayed ? true : undefined;

            if ($stateParams.authorId) {
                vm.authorId = vm.users.filter(function(author) {
                    return author.id === $stateParams.authorId;
                })[0].id;
            }
        }

        /**
         * @ngdoc method
         * @methodOf admin-system-notification-list.controller:SystemNotificationListController
         * @name loadSystemNotifications
         *
         * @description
         * Retrieves the list of system notifications matching the selected filters.
         */
        function loadSystemNotifications() {
            var stateParams = angular.copy($stateParams);

            stateParams.isDisplayed = vm.isDisplayed === true ? vm.isDisplayed : undefined;
            stateParams.authorId = vm.authorId ? vm.authorId : undefined;

            $state.go('openlmis.administration.systemNotification', stateParams, {
                reload: true
            });
        }
    }
})();
