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

    angular
        .module('admin-report-category-add')
        .config(routes);

    routes.$inject = ['modalStateProvider', 'ADMINISTRATION_RIGHTS'];

    function routes(modalStateProvider, ADMINISTRATION_RIGHTS) {
        modalStateProvider.state('openlmis.administration.adminReportsCategoriesList.add', {
            url: '/add/:id',
            label: 'adminReportCategoryAdd.title',
            controller: 'adminReportCategoryAddController',
            controllerAs: 'vm',
            templateUrl: 'admin-report-category-add/admin-report-category-add.html',
            accessRights: [ADMINISTRATION_RIGHTS.REPORT_CATEGORIES_MANAGE],
            resolve: {
                reportCategory: function($stateParams, reportCategoryService) {
                    if ($stateParams.id) {
                        return reportCategoryService.get($stateParams.id);
                    }
                    return undefined;
                }
            }
        });
    }
})();