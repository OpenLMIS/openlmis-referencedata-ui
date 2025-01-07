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
     * @name admin-report-category-list.controller:adminReportCategoriesListController
     *
     * @description
     * Controller for managing reports categories list view.
     */

    angular
        .module('admin-report-category-list')
        .controller('adminReportCategoriesListController', controller);

    controller.$inject = ['$state', 'reportCategoriesList', 'TABLE_CONSTANTS', 'confirmService',
        'reportCategoryService', 'messageService', 'loadingModalService', 'notificationService'];

    function controller($state, reportCategoriesList, TABLE_CONSTANTS, confirmService,
                        reportCategoryService, messageService, loadingModalService, notificationService) {
        var vm = this;

        vm.$onInit = onInit;
        vm.redirectToAddReportCategory = redirectToAddReportCategory;

        /**
         * @ngdoc property
         * @propertyOf admin-report-category-list.controller:adminReportCategoriesListController
         * @name tableConfig
         * @type {Object}
         *
         * @description
         * Holds table config for admin report categories list.
         */
        vm.tableConfig = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-report-category-list.controller:adminReportCategoriesListController
         * @name categoryName
         * @type {String}
         *
         * @description
         * Contains name param for searching report.
         */
        vm.categoryName = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-report-category-list.controller:adminReportCategoriesListController
         * @name reportCategoriesList
         * @type {Array}
         *
         * @description
         * Contains list of report categories.
         */
        vm.reportCategoriesList = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-report-category-list.controller:adminReportCategoriesListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating adminReportCategoriesListController.
         */
        function onInit() {
            vm.reportCategoriesList = reportCategoriesList;
            vm.tableConfig = getTableConfig();
        }

        /**
         * @ngdoc method
         * @methodOf admin-report-category-list.controller:adminReportCategoriesListController
         * @name redirectToAddReportCategory
         *
         * @description
         * Redirects the user to the add report category page/modal.
         */
        function redirectToAddReportCategory() {
            $state.go('openlmis.administration.adminReportsCategoriesList.add');
        }

        /**
         * @ngdoc method
         * @methodOf admin-report-category-list.controller:adminReportCategoriesListController
         * @name deleteReportCategory
         *
         * @description
         * Delete report category.
         */
        function deleteReportCategory(category) {
            var confirmMessage = messageService.get('adminReportCategoriesList.deleteReport.question', {
                categoryName: category.name
            });

            confirmService.confirm(confirmMessage, 'adminReportCategoriesList.delete').then(function() {
                var loadingPromise = loadingModalService.open();
                reportCategoryService.remove(category.id)
                    .then(function() {
                        loadingPromise.then(function() {
                            notificationService.success('adminReportCategoriesList.deleteReport.success');
                        });
                        $state.reload('openlmis.administration.adminReportsCategoriesList');
                    })
                    .catch(function() {
                        loadingModalService.close();
                        notificationService.error('adminReportCategoriesList.deleteReport.fail');
                    });
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-report-category-list.controller:adminReportCategoriesListController
         * @name getTableConfig
         *
         * @description
         * Returns the configuration for the reports list table.
         */
        function getTableConfig() {
            return {
                caption: 'adminReportCategoriesList.noReportCategory',
                displayCaption: !vm.reportCategoriesList || vm.reportCategoriesList.length === 0,
                isSelectable: false,
                columns: [
                    {
                        header: 'adminReportCategoriesList.column.name',
                        propertyPath: 'name',
                        sortable: false,
                        template: function(item) {
                            return item.name;
                        }
                    }
                ],
                actions: {
                    header: 'adminReportCategoriesList.column.actions',
                    data: [
                        {
                            type: TABLE_CONSTANTS.actionTypes.REDIRECT,
                            redirectLink: function(item) {
                                return 'openlmis.administration.adminReportsCategoriesList.add({id:\''
                                + item.id + '\'})';
                            },
                            text: 'adminReportCategoriesList.action.edit'
                        },
                        {
                            type: TABLE_CONSTANTS.actionTypes.CLICK,
                            onClick: function(item) {
                                deleteReportCategory(item);
                            },
                            classes: 'danger',
                            text: 'adminReportCategoriesList.action.delete'
                        }
                    ]
                },
                data: vm.reportCategoriesList
            };
        }
    }
})();
