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
     * @name referencedata-requisition-group.requisitionGroupService
     *
     * @description
     * Responsible for retrieving requisition groups from the server.
     */
    angular
        .module('referencedata-requisition-group')
        .factory('requisitionGroupService', service);

    service.$inject = ['referencedataUrlFactory', '$resource', '$q', 'offlineService', 'localStorageFactory',
        'localStorageService'];

    function service(referencedataUrlFactory, $resource, $q, offlineService, localStorageFactory,
                     localStorageService) {

        var offlineRequisitionGroup = localStorageFactory('requisitionGroups');
        var resource = $resource(referencedataUrlFactory('/api/requisitionGroups/:id'), {}, {
            getAll: {
                url: referencedataUrlFactory('/api/requisitionGroups'),
                method: 'GET',
                isArray: true
            },
            search: {
                url: referencedataUrlFactory('/api/requisitionGroups/search'),
                method: 'POST'
            },
            update: {
                method: 'PUT'
            }
        });

        this.cacheRequisitionGroups = cacheRequisitionGroups;
        this.getRequisitionGroups = getRequisitionGroups;
        this.clearRequisitionGroups = clearRequisitionGroups;

        return {
            get: get,
            getAll: getAll,
            search: search,
            create: create,
            update: update
        };

        /**
         * @ngdoc method
         * @methodOf referencedata-requisition-group.requisitionGroupService
         * @name get
         *
         * @description
         * Gets Requisition Group by id.
         *
         * @param  {String}  id Requisition Group UUID
         * @return {Promise}    Requisition Group info
         */
        function get(id) {
            return resource.get({
                id: id
            }).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-requisition-group.requisitionGroupService
         * @name getAll
         *
         * @description
         * Gets all Requisition Groups.
         *
         * @return {Promise} Array of all programs
         */
        function getAll() {
            if (offlineService.isOffline()) {
                return $q.resolve(getRequisitionGroups());
            }
            return resource.getAll().$promise.then(function(response) {
                clearRequisitionGroups();
                cacheRequisitionGroups(response);
                return $q.resolve(response);
            });
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-requisition-group.requisitionGroupService
         * @name search
         *
         * @description
         * Searches Requisition Groups using given parameters.
         *
         * @param  {Object}  paginationParams the pagination parameters
         * @param  {Object}  queryParams      the search parameters
         * @return {Promise}                  the requested page of filtered requisition groups.
         */
        function search(paginationParams, queryParams) {
            return resource.search(paginationParams, queryParams).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-requisition-group.requisitionGroupService
         * @name update
         *
         * @description
         * Updates requisition group.
         *
         * @param  {Object}  requisitionGroup RequisitionGroup to be updated
         * @return {Promise}         Updated requisitionGroup
         */
        function update(requisitionGroup) {
            return resource.update({
                id: requisitionGroup.id
            }, requisitionGroup).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-requisition-group.requisitionGroupService
         * @name create
         *
         * @description
         * Creates new requisitionGroup.
         *
         * @param  {Object}  requisitionGroup RequisitionGroup to be created
         * @return {Promise}         Updated requisitionGroup
         */
        function create(requisitionGroup) {
            return resource.save(null, requisitionGroup).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-requisition-group.requisitionGroupService
         * @name cacheRequisitionGroups
         *
         * @description
         * Caches given requisition groups in the local storage.
         *
         * @param {Object} requisitionGroups the requisition groups to be cached
         */
        function cacheRequisitionGroups(requisitionGroups) {
            offlineRequisitionGroup.putAll(requisitionGroups);
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-requisition-group.requisitionGroupService
         * @name clearRequisitionGroups
         *
         * @description
         * Deletes Requisition Groups stored in the browser cache.
         */
        function clearRequisitionGroups() {
            localStorageService.remove('requisitionGroups');
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-requisition-group.requisitionGroupService
         * @name getRequisitionGroups
         *
         * @description
         * Gets all Requisition Groups stored in the browser cache.
         */
        function getRequisitionGroups() {
            return $q.resolve(offlineRequisitionGroup.getAll());
        }
    }
})();
