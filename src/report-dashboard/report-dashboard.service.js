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
     * @name report-dashboard.reportDashboardService
     *
     * @description
     * Responsible for retrieving dashboard report information from server.
     */
    angular
        .module('report-dashboard')
        .service('reportDashboardService', service);

    service.$inject = ['openlmisUrlFactory', '$resource'];

    function service(openlmisUrlFactory, $resource) {

        var resource = $resource(openlmisUrlFactory('/api/reports/dashboardReports'), {}, {
            get: {
                method: 'GET',
                url: openlmisUrlFactory('/api/reports/dashboardReports/:id')
            },
            getAll: {
                method: 'GET',
                url: openlmisUrlFactory('/api/reports/dashboardReports')
            },
            getAllForUser: {
                method: 'GET',
                url: openlmisUrlFactory('/api/reports/dashboardReports/availableReports')
            },
            getHomePageReport: {
                method: 'GET',
                url: openlmisUrlFactory('/api/reports/dashboardReports/availableReports?showOnHomePage=true')
            },
            add: {
                method: 'POST',
                url: openlmisUrlFactory('/api/reports/dashboardReports')
            },
            edit: {
                method: 'PUT',
                url: openlmisUrlFactory('/api/reports/dashboardReports/:id')
            },
            remove: {
                method: 'DELETE',
                url: openlmisUrlFactory('/api/reports/dashboardReports/:id')
            }
        });

        return {
            get: get,
            getAll: getAll,
            getAllForUser: getAllForUser,
            add: add,
            edit: edit,
            remove: remove,
            getHomePageReport: getHomePageReport
        };

        function getAll() {
            return resource.getAll().$promise;
        }

        function getAllForUser() {
            return resource.getAllForUser().$promise;
        }

        function get(id) {
            return resource.get({
                id: id
            }).$promise;
        }

        function add(report) {
            return resource.add(report).$promise;
        }

        function edit(report) {
            return resource.edit({
                id: report.id
            }, report).$promise;
        }

        function remove(id) {
            return resource.remove({
                id: id
            }).$promise;
        }

        function getHomePageReport() {
            return resource.getHomePageReport().$promise;
        }

    }
})();
