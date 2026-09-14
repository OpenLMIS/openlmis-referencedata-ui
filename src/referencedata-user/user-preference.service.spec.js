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

describe('userPreferenceService', function() {

    var userPreferenceService, $httpBackend, openlmisUrlFactory, userId;

    beforeEach(function() {
        module('referencedata-user');

        inject(function($injector) {
            userPreferenceService = $injector.get('userPreferenceService');
            $httpBackend = $injector.get('$httpBackend');
            openlmisUrlFactory = $injector.get('openlmisUrlFactory');
        });

        userId = 'user-1';
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('get', function() {

        it('should GET the user preferences map and resolve to it', function() {
            $httpBackend
                .expectGET(openlmisUrlFactory('/api/users/' + userId + '/preferences'))
                .respond(200, {
                    quantityUnit: 'PACKS'
                });

            var result;
            userPreferenceService.get(userId).then(function(data) {
                result = data;
            });
            $httpBackend.flush();

            expect(result.quantityUnit).toEqual('PACKS');
        });
    });

    describe('save', function() {

        it('should PUT the preferences and resolve to the response', function() {
            var preferences = {
                quantityUnit: 'DOSES'
            };

            $httpBackend
                .expectPUT(openlmisUrlFactory('/api/users/' + userId + '/preferences'), preferences)
                .respond(200, preferences);

            var result;
            userPreferenceService.save(userId, preferences).then(function(data) {
                result = data;
            });
            $httpBackend.flush();

            expect(result.quantityUnit).toEqual('DOSES');
        });
    });
});
