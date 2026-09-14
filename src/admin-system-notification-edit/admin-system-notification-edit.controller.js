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
     * @name admin-system-notification-edit.controller:AdminSystemNotificationEditController
     *
     * @description
     * Controller for managing system notification edit screen.
     */
    angular
        .module('admin-system-notification-edit')
        .controller('AdminSystemNotificationEditController', adminSystemNotificationEditController);

    adminSystemNotificationEditController.$inject = [
        'systemNotification', 'author', 'FunctionDecorator', 'SystemNotificationResource', 'successNotificationKey',
        'errorNotificationKey', '$state', 'MAX_SYSTEM_NOTIFICATION_TITLE_LENGTH', 'systemNotificationService'
    ];

    function adminSystemNotificationEditController(systemNotification, author, FunctionDecorator,
                                                   SystemNotificationResource, successNotificationKey,
                                                   errorNotificationKey, $state,
                                                   MAX_SYSTEM_NOTIFICATION_TITLE_LENGTH,
                                                   systemNotificationService) {
        var vm = this;

        vm.$onInit = onInit;
        vm.saveSystemNotification = new FunctionDecorator()
            .decorateFunction(saveSystemNotification)
            .withSuccessNotification(successNotificationKey)
            .withErrorNotification(errorNotificationKey)
            .withLoading(true)
            .getDecoratedFunction();

        /**
         * @ngdoc property
         * @propertyOf admin-system-notification-edit.controller:AdminSystemNotificationEditController
         * @type {Object}
         * @name systemNotification
         *
         * @description
         * Stores the system notification.
         */
        vm.systemNotification = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-system-notification-edit.controller:AdminSystemNotificationEditController
         * @type {Object}
         * @name author
         *
         * @description
         * Stores the author of the system notification.
         */
        vm.author = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-system-notification-edit.controller:AdminSystemNotificationEditController
         * @type {Number}
         * @name maxSystemNotificationTitleLength
         *
         * @description
         * Stores max system notification title length.
         */
        vm.maxSystemNotificationTitleLength = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-system-notification-edit.controller:AdminSystemNotificationEditController
         * @name $onInit
         *
         * @description
         * Initialization method of the AdminSystemNotificationEditController.
         */
        function onInit() {
            vm.systemNotification = systemNotification;
            vm.author = author;
            vm.maxSystemNotificationTitleLength = MAX_SYSTEM_NOTIFICATION_TITLE_LENGTH;
        }

        /**
         * @ngdoc method
         * @methodOf admin-system-notification-edit.controller:AdminSystemNotificationEditController
         * @name saveSystemNotification
         *
         * @description
         * Saves the system notification and returns to parent state if successful.
         */
        function saveSystemNotification() {
            var promise = systemNotification.id ?
                new SystemNotificationResource().update(systemNotification) :
                new SystemNotificationResource().create(systemNotification);

            return promise.then(function() {
                systemNotificationService.clearCachedSystemNotifications();
                $state.go('.^', {}, {
                    reload: true
                });
            });
        }

    }

}());