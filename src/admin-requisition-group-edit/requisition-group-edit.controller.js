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
     * @name admin-requisition-group-edit.controller:RequisitionGroupEditController
     *
     * @description
     * Exposes method for creating/updating requisitionGroup to the modal view.
     */
    angular
        .module('admin-requisition-group-edit')
        .controller('RequisitionGroupEditController', controller);

    controller.$inject = ['$q', '$state', '$stateParams',
        'requisitionGroup', 'facilities', 'facilitiesMap',
        'programs', 'supervisoryNodes', 'processingSchedules',
        'RequisitionGroup', 'requisitionGroupService', 'stateTrackerService',
        'loadingModalService', 'notificationService', 'facilityService', 'memberFacilities'];

    function controller($q, $state, $stateParams,
                        requisitionGroup, facilities, facilitiesMap,
                        programs, supervisoryNodes, processingSchedules,
                        RequisitionGroup, requisitionGroupService, stateTrackerService,
                        loadingModalService, notificationService, facilityService, memberFacilities) {
        var vm = this;

        vm.$onInit = onInit;
        vm.addFacility = addFacility;
        vm.removeFacility = removeFacility;
        vm.addProgramSchedule = addProgramSchedule;
        vm.removeProgramSchedule = removeProgramSchedule;
        vm.save = save;
        vm.searchForFacilities = searchForFacilities;

        /**
         * @ngdoc property
         * @propertyOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @type {RequisitionGroup}
         * @name requisitionGroup
         *
         * @description
         * RequisitionGroup that is being created.
         */
        vm.requisitionGroup = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @type {Array}
         * @name facilities
         *
         * @description
         * The list of facilities available in the system.
         */
        vm.facilities = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @type {Object}
         * @name facilitiesMap
         *
         * @description
         * The map of facilities by ids.
         */
        vm.facilitiesMap = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @type {Array}
         * @name supervisoryNodes
         *
         * @description
         * The list of supervisoryNodes available in the system.
         */
        vm.supervisoryNodes = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @type {Array}
         * @name processingSchedules
         *
         * @description
         * The list of processingSchedules available in the system.
         */
        vm.processingSchedules = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @type {Array}
         * @name programs
         *
         * @description
         * The list of programs available in the system.
         */
        vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-requisition-group-view.controller:RequisitionGroupViewController
         * @name selectedTab
         * @type {Number}
         *
         * @description
         * Contains number of currently selected tab.
         */
        vm.selectedTab = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-requisition-group-view.controller:RequisitionGroupViewController
         * @name memberFacilitiesEditPage
         * @type {any[]}
         *
         * @description
         * Contains current selected page
         */
        vm.memberFacilitiesEditPage = undefined;

        vm.memberFacilities = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @name $onInit
         *
         * @description
         * Initialization method of the RequisitionGroupEditController.
         */
        function onInit() {
            vm.facilitiesMap = facilitiesMap;
            vm.requisitionGroup = requisitionGroup;
            vm.memberFacilities = memberFacilities;
            vm.facilities = facilities;
            vm.supervisoryNodes = supervisoryNodes;
            vm.processingSchedules = processingSchedules;
            vm.programs = programs;
            vm.selectedTab = $stateParams.tab ? parseInt($stateParams.tab) : 0;
            vm.selectedProgramSchedule = {};
        }

        /**
         * @ngdoc method
         * @methodOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @name addFacility
         *
         * @description
         * Adds valid requisitionGroup facility.
         *
         * @return {Promise} the promise resolving to the added facility.
         */
        function addFacility() {
            return facilityService.get(vm.selectedFacility.id)
                .then(function(facility) {
                    memberFacilities.push(facility);
                    return vm.requisitionGroup.addFacility(facility);
                })
                .then(function() {
                    vm.selectedFacility = undefined;
                })
                .catch(function(error) {
                    notificationService.error(error);
                    loadingModalService.close();
                });
        }

        /**
         * @ngdoc method
         * @methodOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @name removeFacility
         *
         * @description
         * Remove requisitionGroup associated facility.
         *
         * @return {Promise} the promise resolving to the removed facility.
         */
        function removeFacility(facility) {
            return vm.requisitionGroup.removeFacility(facility)
                .then(function() {
                    vm.selectedFacility = undefined;
                });
        }

        /**
         * @ngdoc method
         * @methodOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @name addProgramSchedule
         *
         * @description
         * Adds valid requisitionGroup program schedule.
         *
         * @return {Promise} the promise resolving to the added program schedule.
         */
        function addProgramSchedule() {
            var facilityPromise = $q.when();
            if (vm.selectedProgramSchedule.dropOffFacility) {
                facilityPromise = facilityService.get(vm.selectedProgramSchedule.dropOffFacility.id);
            }

            return facilityPromise
                .then(function(facility) {
                    vm.selectedProgramSchedule.dropOffFacility = facility;
                    return vm.requisitionGroup.addProgramSchedule(vm.selectedProgramSchedule);
                })
                .then(function() {
                    vm.selectedProgramSchedule = {};
                })
                .catch(function(error) {
                    notificationService.error(error);
                    loadingModalService.close();
                });
        }

        /**
         * @ngdoc method
         * @methodOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @name removeProgramSchedule
         *
         * @description
         * Remove requisitionGroup associated programSchedule.
         *
         * @return {Promise} the promise resolving to the removed programSchedule.
         */
        function removeProgramSchedule(programSchedule) {
            return vm.requisitionGroup.removeProgramSchedule(programSchedule)
                .then(function() {
                    vm.selectedProgramSchedule = {};
                });
        }

        /**
         * @ngdoc method
         * @methodOf admin-requisition-group-edit.controller:RequisitionGroupEditController
         * @name save
         *
         * @description
         * Saves the requisitionGroup and takes user back to the previous state.
         */
        function save() {
            loadingModalService.open();

            return requisitionGroupService.update(vm.requisitionGroup)
                .then(function(requisitionGroup) {
                    notificationService.success('adminRequisitionGroupAdd.requisitionGroupSavedSuccessfully');
                    stateTrackerService.goToPreviousState();
                    return requisitionGroup;
                })
                .catch(function() {
                    notificationService.error('adminRequisitionGroupAdd.requisitionGroupFailedToSave');
                    loadingModalService.close();
                });
        }

        function searchForFacilities() {
            var stateParams = angular.copy($stateParams);

            stateParams.facilityName = vm.facilityName;
            stateParams.tab = 1;

            $state.go('openlmis.administration.requisitionGroupList.edit', stateParams, {
                reload: true
            });
        }

    }
})();