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
     * @name admin-report-category-add.controller:adminReportCategoryAddController
     *
     * @description
     * Allows user to add new report category
     */
    angular
        .module('admin-report-category-add')
        .controller('adminReportCategoryAddController', adminReportCategoryAddController);

    adminReportCategoryAddController.$inject = ['reportCategoryService', 'loadingModalService', '$state',
        'notificationService', 'reportCategory', 'stateTrackerService'];

    function adminReportCategoryAddController(reportCategoryService, loadingModalService, $state,
                                              notificationService, reportCategory, stateTrackerService) {

        var vm = this;
        vm.$onInit = onInit;

        vm.add = add;
        vm.validateField = validateField;
        vm.invalidFields = new Set();

        /**
         * @ngdoc method
         * @methodOf admin-report-category-add.controller:adminReportCategoryAddController
         * @name goToPreviousState
         *
         * @description
         * Helper for using previous state from view layer
         */
        vm.goToPreviousState = stateTrackerService.goToPreviousState;

        /**
         * @ngdoc property
         * @methodOf admin-report-category-add.controller:adminReportCategoryAddController
         * @name editMode
         * @type {boolean}
         *
         * @description
         * Indicates if report category type is already created.
         */
        vm.editMode = undefined;

        /**
         * @ngdoc property
         * @methodOf admin-report-category-add.controller:adminReportCategoryAddController
         * @name reportCategory
         * @type {Object}
         *
         * @description
         * Current report category
         */
        vm.reportCategory = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-report-category-add.controller:adminReportCategoryAddController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating adminReportCategoryAddController.
         */
        function onInit() {
            vm.reportCategory = reportCategory;
            vm.editMode = !!vm.reportCategory;
        }

        function add() {
            loadingModalService.open();

            if (validateAddReport()) {
                getSavePromise()
                    .then(function() {
                        notificationService.success('adminReportCategoryAdd.success');
                        $state.go('openlmis.administration.adminReportsCategoriesList', {}, {
                            reload: true
                        });
                    })
                    .catch(function() {
                        notificationService.error('adminReportCategoryAdd.error');
                        loadingModalService.close();
                    });
            } else {
                loadingModalService.close();
            }
        }

        function getSavePromise() {
            return vm.editMode ?
                reportCategoryService.update(vm.reportCategory) :
                reportCategoryService.create(vm.reportCategory);
        }

        function validateAddReport() {
            var fieldsToValidate = ['name'];
            fieldsToValidate.forEach(function(fieldName) {
                validateField(vm.reportCategory[fieldName], fieldName);
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
