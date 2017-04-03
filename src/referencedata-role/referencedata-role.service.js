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


(function(){

    'use strict';

    /**
     * @ngdoc service
     * @name referencedata-role.referencedataRoleService
     *
     * @description
     * Responsible for retrieving roles info from the server.
     */
    angular
        .module('referencedata-role')
        .service('referencedataRoleService', service);

    service.$inject = [
        'openlmisUrlFactory', '$resource'
    ];

    function service(openlmisUrlFactory, $resource) {
        var resource = $resource(openlmisUrlFactory('/api/roles'), {}, {
                getAll: {
                    method: 'GET',
                    isArray: true
                }
            });

        this.getAll = getAll;

        /**
         * @ngdoc method
         * @methodOf referencedata-role.referencedataRoleService
         * @name getAll
         *
         * @description
         * Gets all roles.
         *
         * @return {Promise} the array of all roles
         */
        function getAll() {
            return resource.getAll().$promise;
        }
    }
})();
