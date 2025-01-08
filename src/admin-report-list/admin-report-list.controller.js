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
     * @name admin-report-list.controller:ReportListController
     *
     * @description
     * Controller for managing dashboard reports list view.
     */

    angular
        .module('admin-report-list')
        .controller('ReportListController', controller);

    controller.$inject = ['$state', 'reportsList', 'TABLE_CONSTANTS', 'confirmService',
        'reportDashboardService', 'messageService', 'loadingModalService', 'notificationService'];

    function controller($state, reportsList, TABLE_CONSTANTS, confirmService,
                        reportDashboardService, messageService, loadingModalService, notificationService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.redirectToAddReport = redirectToAddReport;

        /**
         * @ngdoc property
         * @propertyOf admin-report-list.controller:ReportListController
         * @name tableConfig
         * @type {Object}
         *
         * @description
         * Holds table config for dashboard reports list.
         */
        vm.tableConfig = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-report-list.controller:ReportListController
         * @name reportName
         * @type {String}
         *
         * @description
         * Contains name param for searching report.
         */
        vm.reportName = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-report-list.controller:ReportListController
         * @name reportsList
         * @type {Array}
         *
         * @description
         * Contains list of dashboard reports.
         */
        vm.reportsList = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-report-list.controller:ReportListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating ReportListController.
         */
        function onInit() {
            vm.reportsList = reportsList;
            vm.tableConfig = getTableConfig();
        }

        /**
         * @ngdoc method
         * @methodOf admin-report-list.controller:ReportListController
         * @name redirectToAddReport
         *
         * @description
         * Redirects the user to the add dashboard report page.
         */
        function redirectToAddReport() {
            $state.go('openlmis.administration.adminReportList.edit');
        }

        /**
         * @ngdoc method
         * @methodOf admin-report-list.controller:ReportListController
         * @name deleteReport
         *
         * @description
         * Delete dashboard report.
         */
        function deleteReport(report) {
            var confirmMessage = messageService.get('adminReportList.deleteReport.question', {
                reportName: report.name
            });

            confirmService.confirm(confirmMessage, 'adminReportList.delete').then(function() {
                var loadingPromise = loadingModalService.open();
                reportDashboardService.remove(report.id)
                    .then(function() {
                        loadingPromise.then(function() {
                            notificationService.success('adminReportList.deleteReport.success');
                        });
                        $state.reload('openlmis.administration.adminReportList');
                    })
                    .catch(function() {
                        loadingModalService.close();
                        notificationService.error('adminReportList.deleteReport.fail');
                    });
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-report-list.controller:ReportListController
         * @name getTableConfig
         *
         * @description
         * Returns the configuration for the reports list table.
         */
        function getTableConfig() {
            return {
                caption: 'adminReportList.noDashboardReport',
                displayCaption: !vm.reportsList || vm.reportsList.length === 0,
                isSelectable: false,
                columns: [
                    {
                        header: 'adminReportList.column.name',
                        propertyPath: 'name',
                        sortable: true,
                        template: function(item) {
                            return item.name;
                        }
                    },
                    {
                        header: 'adminReportList.column.category',
                        propertyPath: 'category',
                        sortable: true,
                        template: function(item) {
                            return item.category.name;
                        }
                    },
                    {
                        header: 'adminReportList.column.type',
                        propertyPath: 'type',
                        sortable: false,
                        template: function(item) {
                            return item.type;
                        }
                    },
                    {
                        header: 'adminReportList.column.enabled',
                        propertyPath: 'enabled',
                        sortable: false,
                        template: '<i ng-class="{\'icon-ok\': item.enabled}"></i>'
                    },
                    {
                        header: 'adminReportList.column.showOnHomePage',
                        propertyPath: 'showOnHomePage',
                        sortable: false,
                        template: '<i ng-class="{\'icon-ok\': item.showOnHomePage}"></i>'
                    }
                ],
                actions: {
                    header: 'adminReportList.column.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.REDIRECT,
                            redirectLink: function(item) {
                                return 'openlmis.administration.adminReportList.edit({id:\'' + item.id + '\'})';
                            },
                            text: 'adminReportList.action.edit'
                        },
                        {
                            type: TABLE_CONSTANTS.actionTypes.CLICK,
                            onClick: function(item) {
                                deleteReport(item);
                            },
                            classes: 'danger',
                            text: 'adminReportList.action.delete'
                        }
                    ]
                },
                data: vm.reportsList
            };
        }
    }
})();
