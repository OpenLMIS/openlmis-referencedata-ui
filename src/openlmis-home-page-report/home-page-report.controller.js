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
     * @name openlmis-home-page-report.controller:OpenlmisHomePageReportController
     * @description
     * Manages the openlmis-home-page-report component
     */
    angular
        .module('openlmis-home-page-report')
        .controller('OpenlmisHomePageReportController', OpenlmisHomePageReportController);

    OpenlmisHomePageReportController.$inject = ['reportDashboardService', 'offlineService', '$sce',
        'supersetOAuthService', '$rootScope', '$state', 'REPORT_TYPES'];

    function OpenlmisHomePageReportController(reportDashboardService, offlineService, $sce, supersetOAuthService,
                                              $rootScope, $state, REPORT_TYPES) {

        var vm = this;
        vm.$onInit = onInit;

        /**
         * @ngdoc property
         * @propertyOf openlmis-home-page-report.controller:OpenlmisHomePageReportController
         * @type {Object}
         * @name report
         *
         * @description
         * Holds information about the home page report
         */
        vm.report = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-home-page-report.controller:OpenlmisHomePageReportController
         * @type {boolean}
         * @name isOffline
         *
         * @description
         * Indicates offline connection.
         */
        vm.isOffline = undefined;

        /**
         * @ngdoc property
         * @propertyOf openlmis-home-page-report.controller:OpenlmisHomePageReportController
         * @name isAuthorized
         * @type {boolean}
         *
         * @description
         * Indicates if the controller is ready for iframe.
         */
        vm.isAuthorized = false;

        /**
         * @ngdoc method
         * @methodOf openlmis-home-page-report.controller:OpenlmisHomePageReportController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating HomeSystemNotificationsController.
         */
        function onInit() {
            vm.isOffline = offlineService.isOffline();

            reportDashboardService.getHomePageReport().then(function(report) {
                if (report.content[0]) {
                    vm.report = report.content[0];
                    vm.report.url = $sce.trustAsResourceUrl(vm.report.url);

                    if (vm.report.type !== REPORT_TYPES.SUPERSET) {
                        vm.isAuthorized = true;
                    }

                    if (!vm.isOffline && vm.report.type === REPORT_TYPES.SUPERSET) {
                        checkAuthorizationInSuperset();
                    }
                }
            });
        }

        $rootScope.$on('openlmis-auth.authorized-in-superset', function() {
            $state.reload();
        });

        function checkAuthorizationInSuperset() {
            supersetOAuthService.checkAuthorizationInSuperset()
                .then(function(data) {
                    vm.supersetOAuthState = data.state;
                    if (data.isAuthorized === true) {
                        vm.isAuthorized = true;
                    }
                });
        }
    }
})();
