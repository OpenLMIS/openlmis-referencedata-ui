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
     * @ngdoc service
     * @name referencedata-role.roleTypeService
     *
     * @description
     * Resolves the type of a role from the rights assigned to it.
     */
    angular
        .module('referencedata-role')
        .factory('roleTypeService', factory);

    function factory() {

        return {
            getType: getType
        };

        /**
         * @ngdoc method
         * @methodOf referencedata-role.roleTypeService
         * @name getType
         *
         * @description
         * Returns the type of the given role. Roles are typed by their rights, so a role that is missing or has no
         * rights has no type. Such a role is logged and undefined is returned.
         *
         * @param  {Object} role the role to resolve the type of
         * @return {String}      the role type, undefined if it cannot be resolved
         */
        function getType(role) {
            if (!role || !role.rights || role.rights.length === 0) {
                // eslint-disable-next-line no-console
                console.error('Cannot resolve role type, role is missing or has no rights:', role && role.name);

                return undefined;
            }

            return role.rights[0].type;
        }
    }

})();
