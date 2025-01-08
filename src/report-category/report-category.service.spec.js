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

describe('reportCategoryService', function() {

    beforeEach(function() {
        module('report-category');

        inject(function($injector) {
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            this.reportCategoryService = $injector.get('reportCategoryService');
            this.ReportCategoryDataBuilder = $injector.get('ReportCategoryDataBuilder');
        });

        this.reportCategory1 = new this.ReportCategoryDataBuilder().build();
        this.reportCategory2 = new this.ReportCategoryDataBuilder().build();

        this.reportCategories = [
            this.reportCategory1,
            this.reportCategory2
        ];
    });

    it('should create report category', function() {
        this.$httpBackend
            .expectPOST(this.openlmisUrlFactory('/api/reports/reportCategories'), this.reportCategory2)
            .respond(200, this.reportCategory2);

        var result;
        this.reportCategoryService
            .create(this.reportCategory2)
            .then(function(data) {
                result = data;
            });
        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(angular.toJson(result)).toEqual(angular.toJson(this.reportCategory2));
    });

    it('should get report category by id', function() {
        this.$httpBackend
            .expectGET(this.openlmisUrlFactory('/api/reports/reportCategories/' + this.reportCategory1.id))
            .respond(200, this.reportCategory1);

        var result;
        this.reportCategoryService
            .get(this.reportCategory1.id)
            .then(function(response) {
                result = response;
            });
        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(angular.toJson(result)).toEqual(angular.toJson(this.reportCategory1));
    });

    it('should update report category', function() {

        this.$httpBackend
            .expectPUT(this.openlmisUrlFactory('/api/reports/reportCategories/' + this.reportCategory1.id))
            .respond(200, this.reportCategory1);

        var result;
        this.reportCategoryService.update(this.reportCategory1).then(function(response) {
            result = response;
        });
        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(angular.toJson(result)).toEqual(angular.toJson(this.reportCategory1));
    });

    it('should get all report categories', function() {

        this.$httpBackend
            .expectGET(this.openlmisUrlFactory('/api/reports/reportCategories'))
            .respond(200, this.reportCategories);

        var result;
        this.reportCategoryService.getAll().then(function(response) {
            result = response;
        });

        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(angular.toJson(result)).toEqual(angular.toJson(this.reportCategories));
    });

    it('should remove the report category', function() {
        this.$httpBackend
            .expectDELETE(this.openlmisUrlFactory('/api/reports/reportCategories/' + this.reportCategory1.id))
            .respond(200);

        var removed;
        this.reportCategoryService
            .remove(this.reportCategory1.id)
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
