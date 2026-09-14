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
     * @name referencedata-user.userPreferenceService
     *
     * @description
     * Reads and writes the current user's preferences (a generic key-value map) through the
     * reference data /api/users/{userId}/preferences endpoint. Used to persist UI display
     * preferences per user so that they survive logout (which clears local storage).
     */
    angular
        .module('referencedata-user')
        .service('userPreferenceService', service);

    service.$inject = ['$http', 'openlmisUrlFactory'];

    function service($http, openlmisUrlFactory) {

        this.get = get;
        this.save = save;

        /**
         * @ngdoc method
         * @methodOf referencedata-user.userPreferenceService
         * @name get
         *
         * @description
         * Retrieves all of the given user's preferences as a key-value map.
         *
         * @param  {String}  userId the UUID of the user
         * @return {Promise}        resolving to a map of preference key to value
         */
        function get(userId) {
            return $http
                .get(openlmisUrlFactory('/api/users/' + userId + '/preferences'))
                .then(function(response) {
                    return response.data;
                });
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user.userPreferenceService
         * @name save
         *
         * @description
         * Creates or updates the given user's preferences. Only the provided keys are affected.
         *
         * @param  {String}  userId      the UUID of the user
         * @param  {Object}  preferences a map of preference key to value to store
         * @return {Promise}             resolving to the user's full set of preferences
         */
        function save(userId, preferences) {
            return $http
                .put(openlmisUrlFactory('/api/users/' + userId + '/preferences'), preferences)
                .then(function(response) {
                    return response.data;
                });
        }
    }
})();
