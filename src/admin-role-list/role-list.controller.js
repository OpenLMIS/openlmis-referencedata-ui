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
     * @name admin-role-list.controller:RoleListController
     *
     * @description
     * Controller for managing roles list screen.
     */
    angular
        .module('admin-role-list')
        .controller('RoleListController', controller);

    controller.$inject = ['roles', '$filter', 'messageService', 'roleTypeService'];

    function controller(roles, $filter, messageService, roleTypeService) {
        var vm = this;

        /**
         * @ngdoc property
         * @propertyOf admin-role-list.controller:RoleListController
         * @name roles
         * @type {Array}
         *
         * @description
         * Array of all roles.
         */
        vm.roles = roles;

        /**
         * @ngdoc property
         * @propertyOf admin-role-list.controller:RoleListController
         * @name rolesPage
         * @type {Array}
         *
         * @description
         * Holds current page of roles.
         */
        vm.rolesPage = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-role-list.controller:RoleListController
         * @name roleTypeLabels
         * @type {Object}
         *
         * @description
         * Translated role type labels, keyed by role id. Roles with no rights have no type, and get a placeholder.
         */
        vm.roleTypeLabels = getRoleTypeLabels(roles);

        function getRoleTypeLabels(roleList) {
            var labels = {};

            angular.forEach(roleList, function(role) {
                var type = roleTypeService.getType(role);

                labels[role.id] = type ?
                    $filter('roleType')(type) : messageService.get('adminRoleList.notApplicable');
            });

            return labels;
        }
    }

})();
