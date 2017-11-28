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

describe('Facility service minimal decorator', function() {
    var facilityService, originalFacilityService, $rootScope, cache;

    beforeEach(module('referencedata-facilities-cache'));

    beforeEach(module(function($provide, $injector){
        cache = jasmine.createSpyObj('cache', ['getAll', 'put']);

        $provide.factory('localStorageFactory', function(){
            return function(){
                return cache;
            };
        });

        cache.getAll.andReturn([]);
    }));

    beforeEach(inject(function(_facilityService_, _$rootScope_){
        facilityService = _facilityService_;
        $rootScope = _$rootScope_;
    }));

    it('will return a cached list of minimal facilities if available', function() {
        cache.getAll.andReturn([{}, {}, {}]);

        var results = false;
        facilityService.getAllMinimal().then(function(res) {
            results = res;
        });
        $rootScope.$apply(); // resolving promises

        expect(results.length).toBe(3);
    });

    it('will return original facilityService.getAllMinimal if no cache', inject(function($httpBackend, referencedataUrlFactory) {
        var facilities = [{
            uuid: 1,
            name: 'example'
        }];

        $httpBackend.whenGET(new RegExp(referencedataUrlFactory('/api/facilities/minimal.*')))
            .respond(200, {'content': facilities});

        cache.getAll.andReturn([]);

        var results;
        facilityService.getAllMinimal().then(function(_results){
            results = _results;
        });
        $httpBackend.flush();
        $rootScope.$apply();

        expect(results.length).toBe(1);

        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

});
