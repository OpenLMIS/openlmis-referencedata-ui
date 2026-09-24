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

describe('openlmisHomeAlertsPanelController', function() {

    beforeEach(function() {
        module('openlmis-home-alerts-panel');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.offlineService = $injector.get('offlineService');
            this.facilityFactory = $injector.get('facilityFactory');
            this.openlmisHomeAlertsPanelService = $injector.get('openlmisHomeAlertsPanelService');
        });

        this.homeFacility = {
            id: 'facility-id',
            name: 'Home Facility'
        };

        spyOn(this.offlineService, 'isOffline').andReturn(false);
        spyOn(this.facilityFactory, 'getUserHomeFacility').andReturn(this.$q.resolve(this.homeFacility));
        spyOn(this.openlmisHomeAlertsPanelService, 'getRequisitionsStatusesData').andReturn(this.$q.resolve({
            statusesStats: {
                SUBMITTED: 2,
                APPROVED: 1
            },
            requisitionsToBeCreated: 3
        }));
        spyOn(this.openlmisHomeAlertsPanelService, 'getOrdersStatusesData').andReturn(this.$q.resolve({
            statusesStats: {
                ORDERED: 4
            }
        }));
        spyOn(this.openlmisHomeAlertsPanelService, 'getMappedStatusesStats').andCallFake(
            function(tableName) {
                return [tableName];
            }
        );

        this.initController = function() {
            this.$ctrl = this.$controller('openlmisHomeAlertsPanelController');
            this.$ctrl.$onInit();
            this.$rootScope.$apply();
        };
    });

    describe('$onInit', function() {

        it('should load the home facility and status stats when online', function() {
            this.initController();

            expect(this.$ctrl.homeFacility).toEqual(this.homeFacility);
            expect(this.openlmisHomeAlertsPanelService.getRequisitionsStatusesData).toHaveBeenCalled();
            expect(this.openlmisHomeAlertsPanelService.getOrdersStatusesData).toHaveBeenCalled();
            expect(this.$ctrl.requisitionsStatusesStats).toEqual(['requisition']);
            expect(this.$ctrl.ordersStatusesStats).toEqual(['orders']);
            expect(this.$ctrl.requisitionsToBeCreated).toBe(3);
        });

        it('should not load stats when the user has no home facility', function() {
            this.facilityFactory.getUserHomeFacility.andReturn(this.$q.resolve(undefined));

            this.initController();

            expect(this.$ctrl.homeFacility).toBeUndefined();
            expect(this.openlmisHomeAlertsPanelService.getRequisitionsStatusesData).not.toHaveBeenCalled();
            expect(this.openlmisHomeAlertsPanelService.getOrdersStatusesData).not.toHaveBeenCalled();
        });

        it('should not make any request when offline', function() {
            this.offlineService.isOffline.andReturn(true);

            this.initController();

            expect(this.facilityFactory.getUserHomeFacility).not.toHaveBeenCalled();
            expect(this.openlmisHomeAlertsPanelService.getRequisitionsStatusesData).not.toHaveBeenCalled();
            expect(this.openlmisHomeAlertsPanelService.getOrdersStatusesData).not.toHaveBeenCalled();
            expect(this.$ctrl.homeFacility).toBeUndefined();
        });
    });
});
