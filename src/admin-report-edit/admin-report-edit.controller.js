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
     * @name admin-report-edit.controller:ReportEditController
     *
     * @description
     * Allows user to edit reports
     */
    angular
        .module('admin-report-edit')
        .controller('ReportEditController', ReportEditController);

    ReportEditController.$inject = ['reportDashboardService', 'loadingModalService', '$state', 'dashboardReport',
        'categories', 'notificationService', 'REPORT_TYPES', 'messageService', 'confirmService',
        'stateTrackerService', 'reportsList'];

    function ReportEditController(reportDashboardService, loadingModalService, $state, dashboardReport,
                                  categories, notificationService, REPORT_TYPES, messageService, confirmService,
                                  stateTrackerService, reportsList) {
        var vm = this;

        vm.$onInit = onInit;
        vm.confirmEdit = confirmEdit;
        vm.validateField = validateField;
        vm.invalidFields = new Set();

        /**
         * @ngdoc method
         * @methodOf admin-report-edit.controller:ReportEditController
         * @name goToPreviousState
         *
         * @description
         * Helper for using previous state from view layer
         */
        vm.goToPreviousState = stateTrackerService.goToPreviousState;

        /**
         * @ngdoc property
         * @methodOf admin-report-edit.controller:ReportEditController
         * @name categories
         * @type {Array}
         *
         * @description
         * Contains list of all report categories
         */
        vm.categories = categories;

        /**
         * @ngdoc property
         * @methodOf admin-report-edit.controller:ReportEditController
         * @name report
         * @type {Object}
         *
         * @description
         * Contains report object.
         */
        vm.report = angular.copy(dashboardReport);

        /**
         * @ngdoc property
         * @methodOf admin-report-edit.controller:ReportEditController
         * @name types
         * @type {Array}
         *
         * @description
         * Contains list of all types of reports
         */
        vm.types = undefined;

        /**
         * @ngdoc property
         * @methodOf admin-report-edit.controller:ReportEditController
         * @name editMode
         * @type {boolean}
         *
         * @description
         * Indicates if report is already created.
         */
        vm.editMode = undefined;

        vm.reportsList = reportsList;

        function onInit() {
            vm.editMode = !!dashboardReport;
            categories.map(function(category) {
                if (vm.report && category.id === vm.report.category.id) {
                    vm.report.category = category;
                }
            });
            vm.types = REPORT_TYPES.getTypes();
        }

        function getActualHomePageReportName() {
            var homePageReport = reportsList.filter(function(item) {
                if (item.showOnHomePage) {
                    return item.name;
                }
            });

            return homePageReport[0] ? homePageReport[0].name : undefined;
        }

        function confirmEdit() {
            if (checkConditionToConfirmMessage()) {
                var confirmMessage = messageService.get('adminReportEdit.confirmChangeOfHomePageReport', {
                    newReport: vm.report.name,
                    actualReport: getActualHomePageReportName()
                });

                confirmService.confirm(confirmMessage,
                    'adminReportEdit.save',
                    'adminReportEdit.cancel')
                    .then(function() {
                        edit();
                    });
            } else {
                edit();
            }
        }

        function checkConditionToConfirmMessage() {
            return vm.report.showOnHomePage === true && (!dashboardReport || (dashboardReport &&
            dashboardReport.showOnHomePage !== true && getActualHomePageReportName() !== undefined));
        }

        function edit() {
            loadingModalService.open();

            if (validateEditReport()) {
                getSavePromise()
                    .then(function() {
                        notificationService.success('adminReportEdit.success');
                        $state.go('openlmis.administration.adminReportList', {}, {
                            reload: true
                        });
                    })
                    .catch(function() {
                        notificationService.error('adminReportEdit.error');
                        loadingModalService.close();
                    });
            } else {
                loadingModalService.close();
            }
        }

        function getSavePromise() {
            return vm.editMode ?
                reportDashboardService.edit(vm.report) : reportDashboardService.add(vm.report);
        }

        function validateEditReport() {
            var fieldsToValidate = ['name', 'url', 'category', 'type'];
            fieldsToValidate.forEach(function(fieldName) {
                validateField(vm.report[fieldName], fieldName);
            });

            return vm.invalidFields.size === 0;
        }

        function isNotEmpty(value) {
            return !!value;
        }

        function validateField(value, fieldName) {
            var isValid = isNotEmpty(value);

            if (vm.invalidFields.has(fieldName) && isValid) {
                vm.invalidFields.delete(fieldName);
            } else if (!isValid) {
                vm.invalidFields.add(fieldName);
            }
        }
    }
})();
