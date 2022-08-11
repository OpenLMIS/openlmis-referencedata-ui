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

describe('ValidDestinationAddController', function() {

    beforeEach(function() {

        this.destinationToAdd =
            {
                programId: 3,
                facilityTypeId: 2,
                name: 'valid destination to add',
                geoZoneId: 1,
                geoLevelId: 3
            };

        this.validDestinations = [
            {
                programId: 1,
                facilityTypeId: 2,
                name: 'valid destination 1',
                geoZoneId: 3,
                geoLevelId: 4
            },
            {
                programId: 0,
                facilityTypeId: 1,
                name: 'valid destination 2',
                geoZoneId: 4,
                geoLevelId: 3
            }
        ];

        module('admin-valid-destination-add');
        inject(function($injector) {
            this.$controller = $injector.get('ValidDestinationAddController');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.notificationService = $injector.get('notificationService');
            this.$state = $injector.get('$state');
            this.confirmService = $injector.get('confirmService');
            this.validDestinationResource = $injector.get('ValidDestinationResource');
            this.loadingModalService = $injector.get('loadingModalService');
        });

        var geoLevelMap = [];
        geoLevelMap[4] = 'geo level 1';

        this.programs = ['program 1'];
        this.facilities = ['type 1'];

        this.controller = this.$controller('ValidDestinationAddController', {
            validDestinations: this.validDestinations,
            programsMap: {
                1: 'program 1'
            },
            facilityTypesMap: {
                2: 'type 1'
            },
            geographicZonesMap: {
                3: 'geo zone 1'
            },
            geographicLevelMap: geoLevelMap,
            programs: this.programs,
            facilities: this.facilities
        });

    });

    it('should assign facilities', function() {
        expect(this.controller.facilities).toEqual(this.facilities);
    });

    it('should assign programs', function() {
        expect(this.controller.programs).toEqual(this.programs);
    });

    describe('submit', function() {
        beforeEach(function() {
            this.confirmDeferred = this.$q.defer();
            this.loadingDeferred = this.$q.defer();

            spyOn(this.loadingModalService, 'open').andReturn(this.loadingDeferred.promise);
            spyOn(this.loadingModalService, 'close').andReturn();
            spyOn(this.confirmService, 'confirm').andReturn(this.confirmDeferred.promise);
            spyOn(this.notificationService, 'error').andReturn();
            spyOn(this.notificationService, 'success').andReturn();

            this.controller.destinationToAdd = this.destinationToAdd;
        });

        it('should save valid destination and open loading modal after confirm', function() {
            this.controller.submit();

            this.confirmService.resolve();
            this.$rootScope.$apply();

            expect(this.controller.validDestinationResource.create).toHaveBeenCalledWith(this.destinationToAdd);
            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should show notification if valid destination was saved successfully', function() {
            this.controller.submit();

            this.confirmDeferred.resolve();
            this.saveDeferred.resolve(this.destinationToAdd);
            this.loadingDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.notificationService.success)
                .toHaveBeenCalledWith('adminValidDestinationAdd.validDestinationAddedSuccessfully');
        });

        it('should show notification if valid destination save has failed', function() {
            this.controller.submit();

            this.confirmDeferred.resolve();
            this.saveDeferred.reject();
            this.$rootScope.$apply();

            expect(this.notificationService.error).toHaveBeenCalledWith('adminValidDestinationAdd.failure');
            expect(this.loadingModalService.close).toHaveBeenCalled();
        });
    });
});