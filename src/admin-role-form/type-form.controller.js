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
     * @name admin-role-form.controller:TypeFormController
     *
     * @description
     * Manages role template selection screen.
     */
    angular
        .module('admin-role-form')
        .controller('TypeFormController', controller);

    controller.$inject = ['$state', '$stateParams', 'types'];

    function controller($state, $stateParams, types) {
        var vm = this;

        vm.selectType = selectType;

        /**
         * @ngdoc property
         * @propertyOf admin-role-form.controller:TypeFormController
         * @type {String}
         * @name roleId
         *
         * @description
         * The UUID of the role being edited, undefined when creating a new role.
         */
        vm.roleId = $stateParams.roleId;

        /**
         * @ngdoc property
         * @propertyOf admin-role-form.controller:TypeFormController
         * @type {List}
         * @name types
         *
         * @description
         * The list of available role templates.
         */
        vm.types = types;

        /**
         * @ngdoc method
         * @methodOf admin-role-form.controller:TypeFormController
         * @name selectType
         *
         * @description
         * Redirects to the role form of the given type, keeping the edited role if there is one.
         *
         * @param   {String}    type    the template name
         */
        function selectType(type) {
            $state.go('openlmis.administration.roles.createUpdate', {
                type: type,
                roleId: $stateParams.roleId
            });
        }
    }

})();
