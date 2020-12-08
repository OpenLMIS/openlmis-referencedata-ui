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
     * @name admin-supply-partner-edit.controller:AssociationModalController
     *
     * @description
     * Controller for managing supply partner edit screen.
     */
    angular
        .module('admin-supply-partner-edit')
        .controller('AssociationModalController', controller);

    controller.$inject = [
        'originalAssociation', 'programs', 'supervisoryNodes', 'ObjectMapper', 'facilities', 'loadingModalService',
        'supplyPartner', 'orderables', 'selectProductsModalService', '$state', 'supplyPartnerAssociationService', '$q',
        'alertService'
    ];

    function controller(originalAssociation, programs, supervisoryNodes, ObjectMapper, facilities, loadingModalService,
                        supplyPartner, orderables, selectProductsModalService, $state, supplyPartnerAssociationService,
                        $q, alertService) {
        var vm = this;

        vm.$onInit = onInit;
        vm.getAvailablePrograms = getAvailablePrograms;
        vm.getAvailableSupervisoryNodes = getAvailableSupervisoryNodes;
        vm.getAvailableFacilities = getAvailableFacilities;
        vm.updateFacilitiesAndProducts = updateFacilitiesAndProducts;
        vm.addFacility = addFacility;
        vm.removeFacility = removeFacility;
        vm.addProducts = addProducts;
        vm.goToPreviousState = goToPreviousState;
        vm.addAssociation = addAssociation;

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.controller:AssociationModalController
         * @name $onInit
         *
         * @description
         * Initialization method of the AssociationModalController.
         */
        function onInit() {
            vm.association = angular.copy(originalAssociation);
            vm.isNew = !vm.association.program || !vm.association.supervisoryNode;
            vm.programs = programs;
            vm.orderables = orderables;
            vm.facilities = facilities;
            vm.facilitiesMap = new ObjectMapper().map(facilities);
            vm.orderablesMap = new ObjectMapper().map(orderables);
            vm.supervisoryNodesMap = new ObjectMapper().map(supervisoryNodes.filter(function(supervisoryNode) {
                return !!supervisoryNode.partnerNodeOf;
            }));
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.controller:AssociationModalController
         * @name getAvailablePrograms
         *
         * @description
         * Returns a list of available programs. Will omit any program that is already associated with the selected
         * supervisory node (if one is already selected).
         *
         * @return {Array}  the list of available programs
         */
        function getAvailablePrograms() {
            if (!vm.association.supervisoryNode) {
                return programs;
            }

            var programsAssociatedWithSupervisoryNode = getProgramsAssociatedWithSupervisoryNode();
            return programs.filter(filterOutByIds(programsAssociatedWithSupervisoryNode));
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.controller:AssociationModalController
         * @name getAvailableSupervisoryNodes
         *
         * @description
         * Returns a list of available supervisory nodes. Will omit any supervisory node that is already associated with
         * the selected  program (if one is already selected).
         *
         * @return {Array}  the list of available supervisory nodes
         */
        function getAvailableSupervisoryNodes() {
            var partnerNodes = supervisoryNodes.filter(filterOutNonPartnerNodes);

            if (!vm.association.program) {
                return partnerNodes;
            }

            var supervisoryNodesAssociatedWithProgram = getSupervisoryNodesAssociatedWithProgram();
            return partnerNodes.filter(filterOutByIds(supervisoryNodesAssociatedWithProgram));
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.controller:AssociationModalController
         * @name getAvailableFacilities
         *
         * @description
         * Return a list of available facilities. Will omit any facilities that already are part of the association.
         *
         * @return {Array}  the list of available facilities
         */
        function getAvailableFacilities() {
            var associatedFacilityIds = vm.association.facilities.map(function(facility) {
                return facility.id;
            });
            return vm.facilities.filter(filterOutByIds(associatedFacilityIds));
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.controller:AssociationModalController
         * @name updateFacilitiesAndProducts
         *
         * @description
         * Updates the lists of available facilities and products. Will clear any associated facilities and products.
         */
        function updateFacilitiesAndProducts() {
            if (!vm.isNew) {
                return;
            }

            loadingModalService.open();
            updateFacilities()
                .then(function() {
                    return updateProducts(false);
                })
                .finally(loadingModalService.close);
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.controller:AssociationModalController
         * @name addFacility
         *
         * @description
         * Adds the selected facility as a part of the association. Will update the list of available products, but
         * won't clear the list of selected ones.
         *
         * @return {Promise}  the promise resolved once everything is updated
         */
        function addFacility() {
            vm.association.facilities.push(vm.selectedFacility);
            updateOptionsAfterFacilityChange(false);
            return $q.resolve();
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.controller:AssociationModalController
         * @name removeFacility
         *
         * @description
         * Removes a facility with the given index from the association. This will update the list of available products
         * as well as clear the list of selected ones if facility list is zero.
         *
         * @param {int} id  the index of the facility
         */
        function removeFacility(id) {
            vm.association.facilities.splice(id, 1);
            updateOptionsAfterFacilityChange(true);
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.controller:AssociationModalController
         * @name addProducts
         *
         * @description
         * Open a modal for selecting products to add. Once the products are selected they will be added to the
         * association.
         */
        function addProducts() {
            var orderablesMap = vm.association.orderables.reduce(function(orderablesMap, orderable) {
                orderablesMap[orderable.id] = _.findWhere(vm.orderables, {
                    id: orderable.id
                });
                return orderablesMap;
            }, {});

            return selectProductsModalService.show({
                products: vm.orderables,
                selections: orderablesMap
            })
                .then(function(orderables) {
                    vm.association.orderables = orderables;
                });
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.controller:AssociationModalController
         * @name goToPreviousState
         *
         * @description
         * Takes the user to the supply partner edit page.
         */
        function goToPreviousState() {
            $state.go('^');
        }

        /**
         * @ngdoc method
         * @methodOf admin-supply-partner-edit.controller:AssociationModalController
         * @name addAssociation
         *
         * @description
         * Saves the association in the supply partner and takes the user back to the supply partner edit page.
         */
        function addAssociation() {
            var errorMessage = validateAssociation();
            if (errorMessage) {
                alertService.error(errorMessage);
            } else {
                supplyPartner.addAssociation(vm.association);
                vm.goToPreviousState();
            }
        }

        function updateOptionsAfterFacilityChange(clearSelectedOrderables) {
            loadingModalService.open();
            updateProducts(clearSelectedOrderables).finally(
                loadingModalService.close
            );
        }

        function updateFacilities() {
            return supplyPartnerAssociationService.getFacilities(vm.association, supervisoryNodes)
                .then(function(facilities) {
                    vm.association.facilities = [];
                    vm.facilities = facilities;
                    vm.facilitiesMap = new ObjectMapper().map(facilities);
                });
        }

        function updateProducts(clearSelectedOrderables) {
            return supplyPartnerAssociationService
                .getOrderables(vm.association, vm.facilities, vm.programs)
                .then(function(orderables) {
                    if (clearSelectedOrderables) {
                        var orderableIds = orderables.map(function(orderable) {
                            return orderable.id;
                        });
                        vm.association.orderables = vm.association.orderables.filter(
                            filterOutNonMatchingIds(orderableIds)
                        );
                    }
                    vm.orderables = orderables;
                    vm.orderablesMap = new ObjectMapper().map(orderables);
                });
        }

        function getProgramsAssociatedWithSupervisoryNode() {
            return filterOutAssociated('program', 'supervisoryNode');
        }

        function getSupervisoryNodesAssociatedWithProgram() {
            return filterOutAssociated('supervisoryNode', 'program');
        }

        function filterOutAssociated(fieldName, groupedBy) {
            return supplyPartner.associations
                .filter(filterOutMatchingOriginalByFieldsId(fieldName))
                .filter(filterOutMatchingCurrentByFieldsId(fieldName))
                .filter(filterOutNotMatchingCurrentByFieldsId(groupedBy))
                .map(mapToFieldsId(fieldName));
        }

        function filterOutMatchingOriginalByFieldsId(fieldName) {
            return function(association) {
                return !originalAssociation[fieldName]
                    || association[fieldName].id !== originalAssociation[fieldName].id;
            };
        }

        function filterOutMatchingCurrentByFieldsId(fieldName) {
            return function(association) {
                return !vm.association[fieldName] || association[fieldName].id !== vm.association[fieldName].id;
            };
        }

        function filterOutNotMatchingCurrentByFieldsId(fieldName) {
            return function(association) {
                return association[fieldName].id === vm.association[fieldName].id;
            };
        }

        function mapToFieldsId(fieldName) {
            return function(association) {
                return association[fieldName].id;
            };
        }

        function filterOutNonPartnerNodes(supervisoryNode) {
            return !!supervisoryNode.partnerNodeOf;
        }

        function filterOutByIds(ids) {
            return function(program) {
                return ids.indexOf(program.id) === -1;
            };
        }

        function filterOutNonMatchingIds(ids) {
            return function(orderable) {
                return ids.indexOf(orderable.id) !== -1;
            };
        }

        function validateAssociation() {
            if (!vm.association.program) {
                return 'adminSupplyPartnerEdit.associationEmptyProgram';
            }
            if (!vm.association.supervisoryNode) {
                return 'adminSupplyPartnerEdit.associationEmptySupervisoryNode';
            }
            if (!vm.association.facilities || vm.association.facilities < 1) {
                return 'adminSupplyPartnerEdit.associationEmptyFacilities';
            }
            if (!vm.association.orderables || vm.association.orderables < 1) {
                return 'adminSupplyPartnerEdit.associationEmptyProducts';
            }
        }
    }
})();