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
     * @name admin-geographic-zone-view.controller:GeographicZoneViewController
     *
     * @description
     * Controller for managing geographic zone view screen.
     */
    angular
        .module('admin-geographic-zone-view')
        .controller('GeographicZoneViewController', controller);

    controller.$inject = [
        'geographicZone',
        'confirmService',
        'geographicZoneService',
        'stateTrackerService',
        'loadingModalService',
        'notificationService',
        'geoZoneCatchmentPopulationService'
    ];

    function controller(
        geographicZone,
        confirmService,
        geographicZoneService,
        stateTrackerService,
        loadingModalService,
        notificationService,
        geoZoneCatchmentPopulationService
    ) {

        var vm = this;

        vm.save = save;
        vm.cancel = stateTrackerService.goToPreviousState;
        vm.$onInit = onInit;

        /**
         * @ngdoc property
         * @propertyOf admin-geographic-zone-view.controller:GeographicZoneViewController
         * @name geographicZone
         * @type {Object}
         *
         * @description
         * Contains geographic zone object.
         */
        vm.geographicZone = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-geographic-zone-view.controller:GeographicZoneViewController
         * @name isEditable
         * 
         * @description
         * Determines if the geographic zone is editable.
         */
        vm.isEditable = false;

        /**
         * @ngdoc method
         * @methodOf admin-geographic-zone-view.controller:GeographicZoneViewController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating GeographicZoneViewController.
         */
        function onInit() {
            vm.geographicZone = geographicZone;
            vm.isEditable = geoZoneCatchmentPopulationService.isEditable(geographicZone);
        }

        /**
         * @ngdoc method
         * @methodOf admin-geographic-zone-view.controller:GeographicZoneViewController
         * @name save
         * 
         * @description
         * Method that saves geographic zone.
         */
        function save() {
            confirmService.confirm('adminGeographicZoneView.saveConfirmation').then(function() {
                loadingModalService.open();
                geographicZoneService.update(vm.geographicZone)
                    .then(function() {
                        notificationService.success('adminGeographicZoneView.save.success');
                        stateTrackerService.goToPreviousState();
                    })
                    .catch(function() {
                        loadingModalService.close();
                        notificationService.error('adminGeographicZoneView.save.error');
                    });
            });
        }
    }
})();
