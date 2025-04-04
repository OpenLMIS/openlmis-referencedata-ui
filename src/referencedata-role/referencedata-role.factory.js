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
     * @name referencedata-role.referencedataRoleFactory
     *
     * @description
     * Allows the user to retrieve roles with additional info.
     */
    angular
        .module('referencedata-role')
        .factory('referencedataRoleFactory', factory);

    factory.$inject = ['$q', 'referencedataRoleService'];

    function factory($q, referencedataRoleService) {

        return {
            getAllWithType: getAllWithType
        };

        /**
         * @ngdoc method
         * @methodOf referencedata-role.referencedataRoleFactory
         * @name getAllWithType
         *
         * @description
         * Retrieves all roles and assigns type attribute to each of them.
         *
         * @return {Promise} array of roles with type property
         */
        function getAllWithType() {
            var deferred = $q.defer();

            referencedataRoleService.getAll().then(function(roles) {
                angular.forEach(roles, function(role) {
                    if (!role || !role.rights || role.rights.length === 0) {
                        const errorMessage =
                        'Role Type Not Applicable: Rights array is missing or empty for role:' +
                        role.name;

                        deferred.reject(errorMessage);
                    }

                    role.type = role.rights[0].type;
                });
                deferred.resolve(roles);
            }, deferred.reject);

            return deferred.promise;
        }
    }

})();
