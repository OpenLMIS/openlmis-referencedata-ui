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

describe('reportDashboardService', function() {

    beforeEach(function() {
        module('report');

        inject(function($injector) {
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            this.reportDashboardService = $injector.get('reportDashboardService');
            this.ReportDashboardDataBuilder = $injector.get('ReportDashboardDataBuilder');
            this.ReportCategoryDataBuilder = $injector.get('ReportCategoryDataBuilder');
        });

        this.reportDashboard = new this.ReportDashboardDataBuilder().build();
        this.reportDashboard2 = new this.ReportDashboardDataBuilder().build();

        this.reportDashboards  = {
            content: [
                this.reportDashboard,
                this.reportDashboard2
            ]
        };

    });

    it('should add report dashboard', function() {
        this.$httpBackend
            .expectPOST(this.openlmisUrlFactory('/api/reports/dashboardReports'), this.reportDashboard)
            .respond(200, this.reportDashboard);

        var result;
        this.reportDashboardService
            .add(this.reportDashboard)
            .then(function(data) {
                result = data;
            });
        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(angular.toJson(result)).toEqual(angular.toJson(this.reportDashboard));
    });

    it('should get report dashboard by id', function() {
        this.$httpBackend
            .expectGET(this.openlmisUrlFactory('/api/reports/dashboardReports/' + this.reportDashboard.id))
            .respond(200, this.reportDashboard);

        var result;
        this.reportDashboardService
            .get(this.reportDashboard.id)
            .then(function(response) {
                result = response;
            });
        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(angular.toJson(result)).toEqual(angular.toJson(this.reportDashboard));
    });

    it('should edit report dashboard', function() {

        this.$httpBackend
            .expectPUT(this.openlmisUrlFactory('/api/reports/dashboardReports/' + this.reportDashboard.id))
            .respond(200, this.reportDashboard);

        var result;
        this.reportDashboardService.edit(this.reportDashboard).then(function(response) {
            result = response;
        });
        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(angular.toJson(result)).toEqual(angular.toJson(this.reportDashboard));
    });

    it('should get all report dashboards', function() {

        this.$httpBackend
            .expectGET(this.openlmisUrlFactory('/api/reports/dashboardReports'))
            .respond(200, this.reportDashboards);

        var result;
        this.reportDashboardService.getAll().then(function(response) {
            result = response;
        });

        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(angular.toJson(result)).toEqual(angular.toJson(this.reportDashboards));
    });

    it('should remove the report dashboard', function() {
        this.$httpBackend
            .expectDELETE(this.openlmisUrlFactory('/api/reports/dashboardReports/' + this.reportDashboard.id))
            .respond(200);

        var removed;
        this.reportDashboardService
            .remove(this.reportDashboard.id)
            .then(function() {
                removed = true;
            });
        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(removed).toBe(true);
    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingExpectation();
        this.$httpBackend.verifyNoOutstandingRequest();
    });
});
