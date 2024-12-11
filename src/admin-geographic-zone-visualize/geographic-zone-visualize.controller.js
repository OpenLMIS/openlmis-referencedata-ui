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
     * @name admin-geographic-zone-visualize.controller:GeographicZoneVisualizeController
     *
     * @description
     * Controller for managing geographic zone visualize screen.
     */
    angular
        .module('admin-geographic-zone-visualize')
        .controller('GeographicZoneVisualizeController', controller);

    controller.$inject = [
        'geographicZone',
        'stateTrackerService',
        'childGeographicZones'
    ];

    function controller(
        geographicZone,
        stateTrackerService,
        childGeographicZones
    ) {

        var vm = this;

        vm.cancel = stateTrackerService.goToPreviousState;
        vm.$onInit = onInit;

        /**
         * @ngdoc property
         * @propertyOf admin-geographic-zone-visualize.controller:GeographicZoneVisualizeController
         * @name geographicZone
         * @type {Object}
         *
         * @description
         * Contains geographic zone object.
         */
        vm.geographicZone = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-geographic-zone-visualize.controller:GeographicZoneVisualizeController
         * @name childGeographicZones
         * 
         * @description
         * Contains child geographic zones of the geographic zone.
         */
        vm.childGeographicZones = [];

        /**
         * @ngdoc method
         * @methodOf admin-geographic-zone-visualize.controller:GeographicZoneVisualizeController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating GeographicZoneVisualizeController.
         */
        function onInit() {
            vm.geographicZone = geographicZone;
            vm.childGeographicZones = childGeographicZones;
        }
    }
})();
