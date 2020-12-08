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

describe('AssociationModalController', function() {

    beforeEach(function() {
        module('admin-supply-partner-edit');

        inject(function($injector) {
            this.SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            this.FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            this.SupplyPartnerDataBuilder = $injector.get('SupplyPartnerDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
            this.SupplyPartnerAssociationDataBuilder = $injector.get('SupplyPartnerAssociationDataBuilder');
            this.FacilityTypeApprovedProductDataBuilder = $injector.get('FacilityTypeApprovedProductDataBuilder');
            this.FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
            this.SupplyPartnerAssociationService = $injector.get('SupplyPartnerAssociationService');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.$controller = $injector.get('$controller');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.SupervisoryNodeFacilityResource = $injector.get('SupervisoryNodeFacilityResource');
            this.FacilityTypeApprovedProductResource = $injector.get('FacilityTypeApprovedProductResource');
            this.loadingModalService = $injector.get('loadingModalService');
            this.selectProductsModalService = $injector.get('selectProductsModalService');
            this.$state = $injector.get('$state');
            this.alertService = $injector.get('alertService');
        });

        this.supplyPartner = new this.SupplyPartnerDataBuilder().buildWithAssociations();
        this.originalAssociation = this.supplyPartner.associations[0];
        this.newOriginalAssociation = new this.SupplyPartnerAssociationDataBuilder().buildCleanNew();
        this.supplyPartnerAssociationService = new this.SupplyPartnerAssociationService();

        this.supervisoryNodes = [
            new this.SupervisoryNodeDataBuilder().build(),
            new this.SupervisoryNodeDataBuilder().build(),
            new this.SupervisoryNodeDataBuilder()
                .withId(this.supplyPartner.associations[0].supervisoryNode.id)
                .withPartnerNodeOf()
                .build(),
            new this.SupervisoryNodeDataBuilder()
                .withId(this.supplyPartner.associations[1].supervisoryNode.id)
                .withPartnerNodeOf()
                .build(),
            new this.SupervisoryNodeDataBuilder().buildPartnerNode()
        ];

        this.programs = [
            this.supplyPartner.associations[0].program,
            this.supplyPartner.associations[1].program,
            new this.ProgramDataBuilder().build()
        ];

        this.facilityTypes = [
            new this.FacilityTypeDataBuilder()
                .withCode('custom-code-one')
                .build(),
            new this.FacilityTypeDataBuilder()
                .withCode('custom-code-two')
                .build()
        ];

        this.facilities = [
            new this.FacilityDataBuilder().build(),
            new this.FacilityDataBuilder().build(),
            new this.FacilityDataBuilder()
                .withId(this.supplyPartner.associations[0].facilities[0].id)
                .withFacilityType(this.facilityTypes[0])
                .build(),
            new this.FacilityDataBuilder()
                .withId(this.supplyPartner.associations[0].facilities[1].id)
                .withFacilityType(this.facilityTypes[1])
                .build(),
            new this.FacilityDataBuilder()
                .withId(this.supplyPartner.associations[1].facilities[0].id)
                .build(),
            new this.FacilityDataBuilder()
                .withId(this.supplyPartner.associations[1].facilities[1].id)
                .build()
        ];

        this.facilitiesMap = {};
        this.facilitiesMap[this.facilities[0].id] = this.facilities[0];
        this.facilitiesMap[this.facilities[1].id] = this.facilities[1];
        this.facilitiesMap[this.facilities[2].id] = this.facilities[2];
        this.facilitiesMap[this.facilities[3].id] = this.facilities[3];
        this.facilitiesMap[this.facilities[4].id] = this.facilities[4];
        this.facilitiesMap[this.facilities[5].id] = this.facilities[5];

        this.orderables = [
            new this.OrderableDataBuilder().build(),
            new this.OrderableDataBuilder().build(),
            new this.OrderableDataBuilder()
                .withId(this.supplyPartner.associations[0].orderables[0].id)
                .build(),
            new this.OrderableDataBuilder()
                .withId(this.supplyPartner.associations[0].orderables[1].id)
                .build(),
            new this.OrderableDataBuilder()
                .withId(this.supplyPartner.associations[1].orderables[0].id)
                .build(),
            new this.OrderableDataBuilder()
                .withId(this.supplyPartner.associations[1].orderables[1].id)
                .build()
        ];

        this.orderablesMap = {};
        this.orderablesMap[this.orderables[0].id] = this.orderables[0];
        this.orderablesMap[this.orderables[1].id] = this.orderables[1];
        this.orderablesMap[this.orderables[2].id] = this.orderables[2];
        this.orderablesMap[this.orderables[3].id] = this.orderables[3];
        this.orderablesMap[this.orderables[4].id] = this.orderables[4];
        this.orderablesMap[this.orderables[5].id] = this.orderables[5];

        this.facilitiesPage = new this.PageDataBuilder()
            .withContent([
                new this.FacilityDataBuilder().build(),
                new this.FacilityDataBuilder().build()
            ])
            .build();

        this.facilityTypeApprovedProductsPage = new this.PageDataBuilder()
            .withContent([
                new this.FacilityTypeApprovedProductDataBuilder().build(),
                new this.FacilityTypeApprovedProductDataBuilder().build()
            ])
            .build();

        spyOn(this.SupervisoryNodeFacilityResource.prototype, 'query');
        spyOn(this.SupervisoryNodeFacilityResource.prototype, 'constructor').andCallThrough();
        spyOn(this.FacilityTypeApprovedProductResource.prototype, 'query');
        spyOn(this.loadingModalService, 'open');
        spyOn(this.loadingModalService, 'close');
        spyOn(this.selectProductsModalService, 'show');
        spyOn(this.supplyPartnerAssociationService, 'getOrderables');
        spyOn(this.supplyPartnerAssociationService, 'getFacilities');
        spyOn(this.$state, 'go');
        spyOn(this.alertService, 'error');

        this.initControllerWithEditedAssociation = function() {
            this.initControllerWith(this.originalAssociation);
        };

        this.initControllerWithNewAssociation = function() {
            this.initControllerWith(this.newOriginalAssociation);
        };

        this.initControllerWith = function(association) {
            this.vm = this.$controller('AssociationModalController', {
                originalAssociation: association,
                programs: this.programs,
                supervisoryNodes: this.supervisoryNodes,
                facilities: this.facilities,
                orderables: this.orderables,
                supplyPartner: this.supplyPartner,
                supplyPartnerAssociationService: this.supplyPartnerAssociationService
            });

            this.vm.$onInit();
        };

        this.initControllerWithEditedAssociation();
    });

    describe('$onInit', function() {

        it('should expose associations copy', function() {
            expect(this.vm.association).toEqual(this.originalAssociation);
            expect(this.vm.association).not.toBe(this.originalAssociation);
        });

        it('should expose programs map', function() {
            expect(this.vm.programs).toEqual(this.programs);
        });

        it('should expose facilities map', function() {
            expect(this.vm.facilitiesMap).toEqual(this.facilitiesMap);
        });

        it('should expose orderables map', function() {
            expect(this.vm.orderablesMap).toEqual(this.orderablesMap);
        });

        it('should expose supervisory map of partner nodes', function() {
            var expectedSupervisoryNodesMap = {};
            expectedSupervisoryNodesMap[this.supervisoryNodes[2].id] = this.supervisoryNodes[2];
            expectedSupervisoryNodesMap[this.supervisoryNodes[3].id] = this.supervisoryNodes[3];
            expectedSupervisoryNodesMap[this.supervisoryNodes[4].id] = this.supervisoryNodes[4];

            expect(this.vm.supervisoryNodesMap).toEqual(expectedSupervisoryNodesMap);
        });

        it('should set isNew flag for new association', function() {
            this.initControllerWithNewAssociation();

            expect(this.vm.isNew).toBe(true);
        });

        it('should not set isNew flag for existing association', function() {
            expect(this.vm.isNew).toBe(false);
        });

    });

    describe('getAvailablePrograms', function() {

        it('should return all programs if no supervisory node is selected', function() {
            this.vm.association.supervisoryNode = undefined;

            var result = this.vm.getAvailablePrograms();

            expect(result).toEqual(this.programs);
        });

        it('should omit programs that are already associated with the selected supervisory node', function() {
            this.vm.association.supervisoryNode = this.supplyPartner.associations[1].supervisoryNode;

            var result = this.vm.getAvailablePrograms();

            expect(result).toEqual([
                this.programs[0],
                this.programs[2]
            ]);
        });

        it('should return currently selected program', function() {
            var result = this.vm.getAvailablePrograms();

            expect(result).toEqual(this.programs);
        });

        it('should return originally selected program when editing association', function() {
            this.vm.association.program = this.programs[2];

            var result = this.vm.getAvailablePrograms();

            expect(result).toEqual(this.programs);
        });

        it('should return matching programs if creating a new association', function() {
            this.initControllerWithNewAssociation();
            this.vm.association.program = this.programs[0];

            var result = this.vm.getAvailablePrograms();

            expect(result).toEqual(this.programs);
        });

        it('should return matching programs if creating a new association and program is not selected', function() {
            this.initControllerWithNewAssociation();
            this.vm.association.supervisoryNode = this.supervisoryNodes[2];

            var result = this.vm.getAvailablePrograms();

            expect(result).toEqual([
                this.programs[1],
                this.programs[2]
            ]);
        });

    });

    describe('getAvailableSupervisoryNodes', function() {

        it('should return all partner supervisory nodes if no program is selected', function() {
            this.vm.association.program = undefined;

            var result = this.vm.getAvailableSupervisoryNodes();

            expect(result).toEqual([
                this.supervisoryNodes[2],
                this.supervisoryNodes[3],
                this.supervisoryNodes[4]
            ]);
        });

        it('should omit supervisory nodes that are already associated with the selected program', function() {
            this.vm.association.program = this.supplyPartner.associations[1].program;

            var result = this.vm.getAvailableSupervisoryNodes();

            expect(result).toEqual([
                this.supervisoryNodes[2],
                this.supervisoryNodes[4]
            ]);
        });

        it('should return currently selected supervisory node', function() {
            var result = this.vm.getAvailableSupervisoryNodes();

            expect(result).toEqual([
                this.supervisoryNodes[2],
                this.supervisoryNodes[3],
                this.supervisoryNodes[4]
            ]);
        });

        it('should return originally selected supervisory node when editing association', function() {
            this.vm.association.supervisoryNode = this.supervisoryNodes[4];

            var result = this.vm.getAvailableSupervisoryNodes();

            expect(result).toEqual([
                this.supervisoryNodes[2],
                this.supervisoryNodes[3],
                this.supervisoryNodes[4]
            ]);
        });

        it('should return matching supervisory nodes if creating a new association', function() {
            this.initControllerWithNewAssociation();
            this.vm.association.supervisoryNode = this.supervisoryNodes[2];

            var result = this.vm.getAvailableSupervisoryNodes();

            expect(result).toEqual([
                this.supervisoryNodes[2],
                this.supervisoryNodes[3],
                this.supervisoryNodes[4]
            ]);
        });

        it('should return matching programs if creating a new association and supervisory node is not selected',
            function() {
                this.initControllerWithNewAssociation();
                this.vm.association.program = this.programs[0];

                var result = this.vm.getAvailableSupervisoryNodes();

                expect(result).toEqual([
                    this.supervisoryNodes[3],
                    this.supervisoryNodes[4]
                ]);
            });

    });

    describe('getAvailableFacilities', function() {

        it('should return all if there are no associated facilities', function() {
            this.vm.association.facilities = [];

            var result = this.vm.getAvailableFacilities();

            expect(result).toEqual(this.facilities);
        });

        it('should omit facilities that are already associated', function() {
            var result = this.vm.getAvailableFacilities();

            expect(result).toEqual([
                this.facilities[0],
                this.facilities[1],
                this.facilities[4],
                this.facilities[5]
            ]);
        });

    });

    describe('addProducts', function() {

        beforeEach(function() {
            this.selectedProducts = [
                new this.OrderableDataBuilder().build(),
                new this.OrderableDataBuilder().build()
            ];

            this.selectProductsModalService.show.andReturn(this.$q.resolve(this.selectedProducts));
        });

        it('should open select products modal', function() {
            this.vm.addProducts();

            var expectedSelections = {};
            expectedSelections[this.vm.orderables[2].id] = this.vm.orderables[2];
            expectedSelections[this.vm.orderables[3].id] = this.vm.orderables[3];

            expect(this.selectProductsModalService.show).toHaveBeenCalledWith({
                selections: expectedSelections,
                products: this.orderables
            });
        });

        it('should add all products to the list', function() {
            this.vm.addProducts();
            this.$rootScope.$apply();

            expect(this.vm.association.orderables).toEqual(this.selectedProducts);
        });

        it('should do nothing if user closes the select products modal', function() {
            this.selectProductsModalService.show.andReturn(this.$q.reject());

            var originalCount = this.vm.association.orderables.length;

            this.vm.addProducts();
            this.$rootScope.$apply();

            expect(this.vm.association.orderables.length).toEqual(originalCount);
        });

    });

    describe('updateFacilities', function() {

        beforeEach(function() {
            this.SupervisoryNodeFacilityResource.prototype.query.andReturn(this.$q.resolve(this.facilitiesPage));
            this.FacilityTypeApprovedProductResource.prototype.query
                .andReturn(this.$q.resolve(this.facilityTypeApprovedProductsPage));
        });

    });

    describe('addFacility', function() {

        beforeEach(function() {
            this.supplyPartnerAssociationService.getOrderables.andReturn(this.$q.resolve([
                this.orderables[0],
                this.orderables[1]
            ]));
        });

        it('should open loading modal', function() {
            this.vm.addFacility();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should close loading modal on success', function() {
            this.vm.addFacility();

            expect(this.loadingModalService.close).not.toHaveBeenCalled();

            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should close loading modal of failure', function() {
            this.FacilityTypeApprovedProductResource.prototype.query.andReturn(this.$q.reject());

            this.vm.addFacility();

            expect(this.loadingModalService.close).not.toHaveBeenCalled();

            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should not clear the list of selected orderables', function() {
            var originalOrderables = angular.copy(this.vm.association.orderables);

            this.vm.addFacility();
            this.$rootScope.$apply();

            expect(this.vm.association.orderables).toEqual(originalOrderables);
        });

        it('should update the map of available orderables', function() {
            this.vm.addFacility();
            this.$rootScope.$apply();

            var expectedOrderablesMap = {};
            expectedOrderablesMap[this.orderables[0].id] = this.orderables[0];
            expectedOrderablesMap[this.orderables[1].id] = this.orderables[1];

            expect(this.vm.orderablesMap).toEqual(expectedOrderablesMap);
        });

        it('should update the list of available orderables', function() {
            this.vm.addFacility();
            this.$rootScope.$apply();

            expect(this.vm.orderables).toEqual([
                this.orderables[0],
                this.orderables[1]
            ]);
        });

        it('should fetch facility type approved products for associated facilities', function() {
            this.vm.addFacility();
            this.$rootScope.$apply();

            expect(this.supplyPartnerAssociationService.getOrderables).toHaveBeenCalledWith(
                this.vm.association,
                this.vm.facilities,
                this.vm.programs
            );
        });

    });

    describe('removeFacility', function() {

        beforeEach(function() {
            this.supplyPartnerAssociationService.getOrderables.andReturn(this.$q.resolve([
                this.orderables[0],
                this.orderables[1]
            ]));
        });

        it('should remove facility from the list of the associated facilities', function() {
            this.vm.removeFacility(this.vm.association.facilities[1]);

            expect(this.vm.association.facilities.length).toBe(1);
        });

        it('should open loading modal', function() {
            this.vm.removeFacility(this.vm.association.facilities[1]);

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should close loading modal on success', function() {
            this.vm.removeFacility(this.vm.association.facilities[1]);

            expect(this.loadingModalService.close).not.toHaveBeenCalled();

            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should close loading modal of failure', function() {
            this.FacilityTypeApprovedProductResource.prototype.query.andReturn(this.$q.reject());

            this.vm.removeFacility(this.vm.association.facilities[1]);

            expect(this.loadingModalService.close).not.toHaveBeenCalled();

            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should update the map of available orderables', function() {
            this.vm.removeFacility(this.vm.association.facilities[1]);
            this.$rootScope.$apply();

            var expectedOrderablesMap = {};
            expectedOrderablesMap[this.orderables[0].id] = this.orderables[0];
            expectedOrderablesMap[this.orderables[1].id] = this.orderables[1];

            expect(this.vm.orderablesMap).toEqual(expectedOrderablesMap);
        });

        it('should update the list of available orderables', function() {
            this.vm.removeFacility(this.vm.association.facilities[1]);
            this.$rootScope.$apply();

            expect(this.vm.orderables).toEqual([
                this.orderables[0],
                this.orderables[1]
            ]);
        });

        it('should clear the product fields if there is no facilities associated', function() {
            this.supplyPartnerAssociationService.getOrderables.andReturn(this.$q.resolve([]));

            this.vm.association.facilities = [
                this.vm.association.facilities[1]
            ];
            this.vm.removeFacility(this.vm.association.facilities[0]);
            this.$rootScope.$apply();

            expect(this.vm.association.orderables).toEqual([]);
            expect(this.vm.orderablesMap).toEqual({});
            expect(this.vm.orderables).toEqual([]);
        });

        it('should not clear orderables if there is still a facility associated', function() {
            this.vm.removeFacility(this.vm.association.facilities[0]);
            this.$rootScope.$apply();

            expect(this.vm.association.facilities.length).not.toEqual(0);
            expect(this.vm.orderables.length).not.toEqual(0);
        });

        it('should fetch facility type approved products for associated facilities', function() {
            this.vm.addFacility();
            this.$rootScope.$apply();

            expect(this.supplyPartnerAssociationService.getOrderables).toHaveBeenCalledWith(
                this.vm.association,
                this.vm.facilities,
                this.vm.programs
            );
        });

    });

    describe('updateFacilitiesAndProducts', function() {

        beforeEach(function() {
            this.supplyPartnerAssociationService.getFacilities.andReturn(this.$q.resolve([
                this.facilities[0],
                this.facilities[1]
            ]));
            this.supplyPartnerAssociationService.getOrderables.andReturn(this.$q.resolve([
                this.orderables[0],
                this.orderables[1]
            ]));

            this.initControllerWithNewAssociation();
        });

        it('should clear the associated facilities', function() {
            this.vm.updateFacilitiesAndProducts();
            this.$rootScope.$apply();

            expect(this.vm.association.facilities).toEqual([]);
        });

        it('should clear the associated orderables', function() {
            this.vm.updateFacilitiesAndProducts();
            this.$rootScope.$apply();

            expect(this.vm.association.orderables).toEqual([]);
        });

        it('should open loading modal', function() {
            this.vm.updateFacilitiesAndProducts();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should close loading modal on success', function() {
            this.vm.updateFacilitiesAndProducts();

            expect(this.loadingModalService.close).not.toHaveBeenCalled();

            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should close loading modal of failure', function() {
            this.SupervisoryNodeFacilityResource.prototype.query.andReturn(this.$q.reject());

            this.vm.updateFacilitiesAndProducts();

            expect(this.loadingModalService.close).not.toHaveBeenCalled();

            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should update the map of available facilities', function() {
            this.vm.updateFacilitiesAndProducts();
            this.$rootScope.$apply();

            var expectedFacilitiesMap = {};
            expectedFacilitiesMap[this.facilities[0].id] = this.facilities[0];
            expectedFacilitiesMap[this.facilities[1].id] = this.facilities[1];

            expect(this.vm.facilitiesMap).toEqual(expectedFacilitiesMap);
        });

        it('should update the list of available facilities', function() {
            this.vm.updateFacilitiesAndProducts();
            this.$rootScope.$apply();

            expect(this.vm.facilities).toEqual([
                this.facilities[0],
                this.facilities[1]
            ]);
        });

        it('should clear the facility fields if supervisory node is unselected', function() {
            this.supplyPartnerAssociationService.getFacilities.andReturn(this.$q.resolve([]));
            this.vm.association.supervisoryNode = undefined;

            this.vm.updateFacilitiesAndProducts();
            this.$rootScope.$apply();

            expect(this.vm.association.facilities).toEqual([]);
            expect(this.vm.facilitiesMap).toEqual({});
            expect(this.vm.facilities).toEqual([]);
        });

        it('should clear the facility fields if program is unselected', function() {
            this.supplyPartnerAssociationService.getFacilities.andReturn(this.$q.resolve([]));
            this.vm.association.program = undefined;

            this.vm.updateFacilitiesAndProducts();
            this.$rootScope.$apply();

            expect(this.vm.association.facilities).toEqual([]);
            expect(this.vm.facilitiesMap).toEqual({});
            expect(this.vm.facilities).toEqual([]);
        });

    });

    describe('goToPreviousState', function() {

        it('should take user to the parent state', function() {
            this.vm.goToPreviousState();

            expect(this.$state.go).toHaveBeenCalledWith('^');
        });

    });

    describe('addAssociation', function() {

        beforeEach(function() {
            this.vm.association = {
                program: this.programs[0],
                supervisoryNode: this.supervisoryNodes[0],
                facilities: this.facilities,
                orderables: this.orderables
            };
        });

        it('should show error message if program is undefined', function() {
            this.vm.association.program = undefined;
            this.vm.addAssociation();

            expect(this.alertService.error).toHaveBeenCalledWith('adminSupplyPartnerEdit.associationEmptyProgram');
        });

        it('should show error message if supervisory node is undefined', function() {
            this.vm.association.supervisoryNode = undefined;
            this.vm.addAssociation();

            expect(this.alertService.error)
                .toHaveBeenCalledWith('adminSupplyPartnerEdit.associationEmptySupervisoryNode');
        });

        it('should show error message if facilities are undefined', function() {
            this.vm.association.facilities = undefined;
            this.vm.addAssociation();

            expect(this.alertService.error).toHaveBeenCalledWith('adminSupplyPartnerEdit.associationEmptyFacilities');
        });

        it('should show error message if facilities are empty', function() {
            this.vm.association.facilities = [];
            this.vm.addAssociation();

            expect(this.alertService.error).toHaveBeenCalledWith('adminSupplyPartnerEdit.associationEmptyFacilities');
        });

        it('should show error message if orderables are undefined', function() {
            this.vm.association.orderables = undefined;
            this.vm.addAssociation();

            expect(this.alertService.error).toHaveBeenCalledWith('adminSupplyPartnerEdit.associationEmptyProducts');
        });

        it('should show error message if orderables are empty', function() {
            this.vm.association.orderables = [];
            this.vm.addAssociation();

            expect(this.alertService.error).toHaveBeenCalledWith('adminSupplyPartnerEdit.associationEmptyProducts');
        });
    });

});
