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
     * @name referencedata-user.ReferenceDataUserResource
     *
     * @description
     * Communicates with the reference data User REST API of the OpenLMIS server.
     */
    angular
        .module('referencedata-user')
        .factory('ReferenceDataUserResource', ReferenceDataUserResource);

    ReferenceDataUserResource.$inject = [
        'openlmisUrlFactory', 'OpenlmisResource', 'classExtender', '$resource', '$q'
    ];

    function ReferenceDataUserResource(openlmisUrlFactory, OpenlmisResource, classExtender, $resource, $q) {

        classExtender.extend(ReferenceDataUserResource, OpenlmisResource);

        ReferenceDataUserResource.prototype.update = update;
        ReferenceDataUserResource.prototype.deleteUser = deleteUser;

        return ReferenceDataUserResource;

        /**
         * @ngdoc method
         * @methodOf referencedata-user.ReferenceDataUserResource
         * @name ReferenceDataUserResource
         * @constructor
         *
         * @description
         * Creates an object of the ReferenceDataUserResource class and initiates all required dependencies.
         */
        function ReferenceDataUserResource() {
            var resourceUrl = openlmisUrlFactory('/api/users');
            this.super(resourceUrl);
            this.resource = $resource(resourceUrl + '/:id', {}, {
                query: {
                    url: resourceUrl,
                    isArray: false
                },
                update: {
                    url: resourceUrl,
                    method: 'PUT'
                },
                delete: {
                    url: openlmisUrlFactory('api/users/:id'),
                    method: 'DELETE'
                }
            });
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user.ReferenceDataUserResource
         * @name update
         *
         * @description
         * Saves the given user on the OpenLMIS server. Uses PUT method.
         *
         * @param  {Object}  user the user to be saved on the server
         * @return {Promise}      the promise resolving to the server response, rejected if request fails or user is
         *                        undefined
         */
        function update(user) {
            if (user) {
                return this.resource.update(undefined, user).$promise;
            }
            return $q.reject();
        }

        function deleteUser(userId) {
            return this.resource
                .delete({
                    id: userId
                }).$promise;
        }
    }
})();
