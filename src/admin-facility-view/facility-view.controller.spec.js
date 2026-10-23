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

describe('FacilityViewController', function() {

    beforeEach(function() {
        module('admin-facility-view');
        module('referencedata-period');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$controller = $injector.get('$controller');
            this.$state = $injector.get('$state');
            this.notificationService = $injector.get('notificationService');
            this.loadingModalService = $injector.get('loadingModalService');
            this.FacilityRepository = $injector.get('FacilityRepository');
            this.FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
            this.GeographicZoneDataBuilder = $injector.get('GeographicZoneDataBuilder');
            this.FacilityOperatorDataBuilder = $injector.get('FacilityOperatorDataBuilder');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            this.FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            this.messageService = $injector.get('messageService');
        });

        spyOn(this.messageService, 'get').andCallThrough();

        spyOn(this.FacilityRepository.prototype, 'update').andReturn(this.$q.when());

        var loadingModalPromise = this.$q.defer();
        spyOn(this.loadingModalService, 'close').andCallFake(loadingModalPromise.resolve);
        spyOn(this.loadingModalService, 'open').andReturn(loadingModalPromise.promise);

        spyOn(this.notificationService, 'success').andReturn(true);
        spyOn(this.notificationService, 'error').andReturn(true);
        spyOn(this.$state, 'go').andCallFake(loadingModalPromise.resolve);

        this.facilityTypes = [
            new this.FacilityTypeDataBuilder().build(),
            new this.FacilityTypeDataBuilder().build()
        ];

        this.geographicZones = [
            new this.GeographicZoneDataBuilder().build(),
            new this.GeographicZoneDataBuilder().build()
        ];

        this.facilityOperators = [
            new this.FacilityOperatorDataBuilder().build(),
            new this.FacilityOperatorDataBuilder().build()
        ];

        this.programs = [
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build()
        ];

        this.facility = new this.FacilityDataBuilder().withFacilityType(this.facilityTypes[0])
            .build();

        this.vm = this.$controller('FacilityViewController', {
            facility: this.facility,
            facilityTypes: this.facilityTypes,
            geographicZones: this.geographicZones,
            facilityOperators: this.facilityOperators,
            programs: this.programs
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose goToFacilityList method', function() {
            expect(angular.isFunction(this.vm.goToFacilityList)).toBe(true);
        });

        it('should expose saveFacility method', function() {
            expect(angular.isFunction(this.vm.saveFacilityDetails)).toBe(true);
        });

        it('should expose facility', function() {
            expect(this.vm.facility).toEqual(this.facility);
        });

        it('should expose facilityTypes list', function() {
            expect(this.vm.facilityTypes).toEqual(this.facilityTypes);
        });

        it('should expose geographicZones list', function() {
            expect(this.vm.geographicZones).toEqual(this.geographicZones);
        });

        it('should expose facilityOperators list', function() {
            expect(this.vm.facilityOperators).toEqual(this.facilityOperators);
        });

        it('should expose program list', function() {
            expect(this.vm.programs).toEqual(this.programs);
        });

        it('should initialize extraData when missing', function() {
            this.facility.extraData = undefined;

            this.vm.$onInit();

            expect(this.vm.facility.extraData).toEqual({});
        });

        it('should preserve existing extraData', function() {
            this.facility.extraData = {
                quantityUnitDisplay: 'DOSES'
            };

            this.vm.$onInit();

            expect(this.vm.facility.extraData.quantityUnitDisplay).toEqual('DOSES');
        });

        it('should expose quantity unit display options', function() {
            this.vm.$onInit();

            var values = this.vm.quantityUnitDisplayOptions.map(function(option) {
                return option.value;
            });

            expect(values).toEqual([undefined, 'PACKS', 'DOSES', 'BOTH']);
        });

        it('should label the quantity unit display options from the expected message keys', function() {
            this.vm.$onInit();

            expect(this.messageService.get).toHaveBeenCalledWith('adminFacilityAdd.quantityUnitDisplay.systemDefault');
            expect(this.messageService.get).toHaveBeenCalledWith('adminFacilityAdd.quantityUnitDisplay.packsOnly');
            expect(this.messageService.get).toHaveBeenCalledWith('adminFacilityAdd.quantityUnitDisplay.dosesOnly');
            expect(this.messageService.get).toHaveBeenCalledWith('adminFacilityAdd.quantityUnitDisplay.packsAndDoses');
        });

        it('should expose supported programs list', function() {
            expect(this.vm.facilityWithPrograms.supportedPrograms).toEqual([]);
        });

        it('should expose supported programs list as empty list if undefined', function() {
            this.vm.facility.supportedPrograms = undefined;
            this.vm.$onInit();

            expect(this.vm.facilityWithPrograms.supportedPrograms).toEqual([]);
        });

        it('should expose managedExternally flag', function() {
            spyOn(this.facility, 'isManagedExternally').andReturn(true);

            this.vm.$onInit();

            expect(this.vm.managedExternally).toBe(true);
        });

        it('should expose original facility name', function() {
            this.vm.$onInit();

            expect(this.vm.originalFacilityName).toEqual(this.facility.name);

            this.vm.facility.name += ' (Edited)';

            expect(this.vm.originalFacilityName).not.toBe(this.vm.facility.name);
        });
    });

    describe('goToFacilityList', function() {

        it('should call state go with correct params', function() {
            this.vm.goToFacilityList();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.facilities', {}, {
                reload: true
            });
        });
    });

    describe('saveFacility', function() {

        it('should open loading modal', function() {
            this.vm.saveFacilityDetails();
            this.$rootScope.$apply();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should call this.FacilityRepository save method', function() {
            this.vm.saveFacilityDetails();
            this.$rootScope.$apply();

            expect(this.FacilityRepository.prototype.update).toHaveBeenCalledWith(this.vm.facility);
        });

        it('should persist the selected quantity unit display in facility extraData', function() {
            this.vm.facility.extraData = {
                quantityUnitDisplay: 'DOSES'
            };

            this.vm.saveFacilityDetails();
            this.$rootScope.$apply();

            expect(this.FacilityRepository.prototype.update.calls[0].args[0].extraData.quantityUnitDisplay)
                .toEqual('DOSES');
        });

        it('should close loading modal and show error notification after save fails', function() {
            this.FacilityRepository.prototype.update.andReturn(this.$q.reject());
            this.vm.saveFacilityDetails();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
            expect(this.notificationService.error).toHaveBeenCalledWith('adminFacilityView.saveFacility.fail');
        });

        it('should go to facility list after successful save', function() {
            this.vm.saveFacilityDetails();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.facilities', {}, {
                reload: true
            });
        });

        it('should show success notification after successful save', function() {
            this.vm.saveFacilityDetails();
            this.$rootScope.$apply();

            expect(this.notificationService.success).toHaveBeenCalledWith('adminFacilityView.saveFacility.success');
        });
    });

    describe('addProgram', function() {

        beforeEach(function() {
            this.vm.facilityWithPrograms = {};
            this.vm.facilityWithPrograms.supportedPrograms = [];
        });

        it('should add supported program to the list', function() {
            this.vm.selectedProgram = this.vm.programs[0];
            this.vm.selectedStartDate = new Date('08/10/2017');

            var program = this.vm.selectedProgram;

            this.vm.addProgram();

            expect(this.vm.facilityWithPrograms.supportedPrograms[0])
                .toEqual(angular.extend({}, program, {
                    supportStartDate: new Date('08/10/2017'),
                    supportActive: true
                }));
        });

        it('should clear selections', function() {
            this.vm.selectedProgram = this.vm.programs[0];
            this.vm.selectedStartDate = new Date('08/10/2017');

            this.vm.addProgram();

            expect(this.vm.selectedProgram).toBe(null);
            expect(this.vm.selectedStartDate).toBe(null);
        });

    });
});
