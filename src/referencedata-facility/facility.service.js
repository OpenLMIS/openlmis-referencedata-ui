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
     * @name referencedata-facility.facilityService
     *
     * @description
     * Responsible for retrieving all facility information from server.
     */
    angular
    .module('referencedata-facility')
    .service('facilityService', service);

    service.$inject = [
        '$q', '$resource', 'referencedataUrlFactory', 'offlineService',
        'localStorageFactory', 'permissionService'
    ];

    function service($q, $resource, referencedataUrlFactory, offlineService,
        localStorageFactory, permissionService) {

            var facilitiesOffline = localStorageFactory('facilities'),
            resource = $resource(referencedataUrlFactory('/api/facilities/:id'), {}, {
                query: {
                    url: referencedataUrlFactory('/api/facilities/'),
                    method: 'GET',
                    isArray: true
                },
                getAllMinimal: {
                    url: referencedataUrlFactory('/api/facilities/minimal'),
                    method: 'GET',
                    isArray: true
                },
                getUserSupervisedFacilities: {
                    url: referencedataUrlFactory('api/users/:userId/supervisedFacilities'),
                    method: 'GET',
                    isArray: true
                },
                getFulfillmentFacilities: {
                    url: referencedataUrlFactory('/api/users/:userId/fulfillmentFacilities'),
                    method: 'GET',
                    isArray: true
                },
                search: {
                    url: referencedataUrlFactory('/api/facilities/search'),
                    method: 'POST'
                },
                update: {
                    method: 'PUT'
                }
            });

            this.get = get;
            this.query = query;
            this.getAllMinimal = getAllMinimal;
            this.getUserFacilitiesForRight = getUserFacilitiesForRight;
            this.getUserSupervisedFacilities = getUserSupervisedFacilities;
            this.getFulfillmentFacilities = getFulfillmentFacilities;
            this.search = search;
            this.save = save;

            /**
             * @ngdoc method
             * @methodOf referencedata-facility.facilityService
             * @name get
             *
             * @description
             * Retrieves facility by id. When user is offline it gets facility from offline storage.
             * If user is online it stores facility into offline storage.
             *
             * @param  {String}  facilityId Facility UUID
             * @return {Promise}            facility promise
             */
            function get(facilityId) {
                var facility,
                deferred = $q.defer();

                if(offlineService.isOffline()) {
                    facility = facilitiesOffline.getBy('id', facilityId);
                    facility ? deferred.resolve(facility) : deferred.reject();
                } else {
                    resource.get({id: facilityId}, function(data) {
                        facilitiesOffline.put(data);
                        deferred.resolve(data);
                    }, function() {
                        deferred.reject();
                    });
                }

                return deferred.promise;
            }

            /**
             * @ngdoc method
             * @methodOf referencedata-facility.facilityService
             * @name query
             *
             * @description
             * Retrieves all facilities that match given params or all facilities when no params provided.
             * When user is offline it gets facilities from offline storage.
             * If user is online it stores all facilities into offline storage.
             *
             * @param  {String}  queryParams      the search parameters
             * @return {Promise} Array of facilities
             */
            function query(queryParams) {
                var deferred = $q.defer();

                if(offlineService.isOffline()) {
                    deferred.resolve(facilitiesOffline.getAll());
                } else {
                    resource.query(queryParams, function(facilities) {
                        angular.forEach(facilities, function(facility) {
                            facilitiesOffline.put(facility);
                        });
                        deferred.resolve(facilities);
                    }, function() {
                        deferred.reject();
                    });
                }

                return deferred.promise;
            }

            /**
             * @ngdoc method
             * @methodOf referencedata-facility.facilityService
             * @name search
             *
             * @description
             * Searches facilities using given parameters.
             *
             * @param  {Object}  paginationParams the pagination parameters
             * @param  {Object}  queryParams      the search parameters
             * @return {Promise}                  the requested page of filtered facilities.
             */
            function search(paginationParams, queryParams) {
                return resource.search(paginationParams, queryParams).$promise;
            }

            /**
             * @ngdoc method
             * @methodOf referencedata-facility.facilityService
             * @name getUserSupervisedFacilities
             *
             * @description
             * Returns facilities where program with the given programId is active and where the given
             * user has right with the given rightId. Facilities are stored in local storage.
             * If user is offline facilities are retrieved from the local storage.
             *
             * @param  {String}  userId    User UUID
             * @param  {String}  programId Program UUID
             * @param  {String}  rightId   Right UUID
             * @return {Promise}           supervised facilities for user
             */
            function getUserSupervisedFacilities(userId, programId, rightId) {
                var deferred = $q.defer();
                if(offlineService.isOffline()) {
                    var facilities = facilitiesOffline.search({
                        userIdOffline: userId,
                        programIdOffline: programId,
                        rightIdOffline: rightId
                    });
                    deferred.resolve(facilities);
                } else {
                    resource.getUserSupervisedFacilities({
                        userId: userId,
                        programId: programId,
                        rightId: rightId
                    }, function(response) {
                        angular.forEach(response, function(facility) {
                            var storageFacility = angular.copy(facility);
                            storageFacility.userIdOffline = userId;
                            storageFacility.programIdOffline = programId;
                            storageFacility.rightIdOffline = rightId;
                            facilitiesOffline.put(storageFacility);
                        });
                        deferred.resolve(response);
                    }, function() {
                        deferred.reject();
                    });
                }
                return deferred.promise;
            }

            /**
             * @ngdoc method
             * @methodOf referencedata-facility.facilityService
             * @name save
             *
             * @description
             * Saves the given facility on the OpenLMIS server. If object has id PUT method is called, if not POST.
             *
             * @param   {Object}    facility    the facility to be saveDeferred
             * @return  {Promise}               the saved facility
             */
            function save(facility) {
                if (facility.id) {
                    return resource.update({
                        id: facility.id
                    }, facility).$promise;
                }
                return resource.save(null, facility).$promise;
            }

            /**
             * @ngdoc method
             * @methodOf referencedata-facility.facilityService
             * @name getFulfillmentFacilities
             *
             * @description
             * Returns user fulfillment facilities.
             *
             * @param  {Object}  params the request params with userId and right id
             * @return {Promise}        fulfillment facilities for given user and right
             */
            function getFulfillmentFacilities(params) {
                return resource.getFulfillmentFacilities(params).$promise;
            }


            /**
             * @ngdoc method
             * @methodOf referencedata-facility.facilityService
             * @name getUserFacilitiesForRight
             *
             * @description
             * Returns all facilities that a user has a permission with the given
             * right for.
             *
             * @param  {String}  userId The user's id that we are checking
             * @param  {String}  right  The right name that we are checking
             * @return {Promise}        An array of matching facilities.
             */
            function getUserFacilitiesForRight(userId, right) {
                if(!userId || !right) {
                    return $q.reject();
                }
                return $q.all({
                    permissions: permissionService.load(userId),
                    minimalFacilities: this.getAllMinimal()
                })
                .then(function(results) {
                    var permissions = results.permissions,
                        minimalFacilities = results.minimalFacilities,
                        facilityHash = {};

                    permissions.forEach(function(permission) {
                        if(permission.right === right) {
                            if(!facilityHash[permission.facilityId]) {
                                facilityHash[permission.facilityId] = {
                                    id: permission.facilityId,
                                    supportedPrograms: []
                                };
                            }

                            if(permission.programId) {
                                facilityHash[permission.facilityId].supportedPrograms.push({
                                    id:permission.programId
                                });
                            }
                        }
                    });

                    minimalFacilities.forEach(function(facility) {
                        if(facilityHash[facility.id]) {
                            _.extend(facilityHash[facility.id], facility);
                        }
                    });
                    return facilityHash;
                })
                .then(function(facilityHash) {
                    var facilities = [];
                    Object.keys(facilityHash).forEach(function(id) {
                        facilities.push(facilityHash[id]);
                    });

                    return _.sortBy(facilities, 'name');
                });
            }

            /**
             * @ngdoc method
             * @methodOf referencedata-facility.facilityService
             * @name getAllMinimal
             *
             * @description
             * Retrieves all facilities with id and name fields.
             *
             * @return {Promise} Array of facilities with minimal representation
             */
            function getAllMinimal() {
                return resource.getAllMinimal().$promise;
            }
        }
    })();
