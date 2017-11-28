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

describe('facilityService', function() {

    var $rootScope, $httpBackend, referencedataUrlFactory, facilityService, offlineService,
        facilitiesStorage, facilityOne, facilityTwo, $q;

    beforeEach(function() {
        module('referencedata-facility', function($provide){

            facilitiesStorage = jasmine.createSpyObj('facilitiesStorage', ['getBy', 'getAll', 'put', 'search']);
            var localStorageFactorySpy = jasmine.createSpy('localStorageFactory').andCallFake(function() {
                return facilitiesStorage;
            });
            $provide.service('localStorageFactory', function() {
                return localStorageFactorySpy;
            });

            offlineService = jasmine.createSpyObj('offlineService', ['isOffline', 'checkConnection']);
            // Mocking out run call
            offlineService.checkConnection.andCallFake(function() {
                return {
                    finally: function() {}
                }
            });

            $provide.service('offlineService', function() {
                return offlineService;
            });

        });

        inject(function($injector) {
            $q = $injector.get('$q');
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            facilityService = $injector.get('facilityService');
        });

        facilityOne = {
            id: '1',
            name: 'facilityOne'
        };
        facilityTwo = {
            id: '2',
            name: 'facilityTwo'
        };
    });

    describe('get', function() {

        it('should get facility by id from storage while offline', function() {
            var data;

            facilitiesStorage.getBy.andReturn(facilityTwo);

            offlineService.isOffline.andReturn(true);

            facilityService.get(facilityTwo.id).then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data.id).toBe(facilityTwo.id);
        });

        it('should get facility by id and save it to storage', function() {
            var data,
                spy = jasmine.createSpy();

            $httpBackend.when('GET', referencedataUrlFactory('/api/facilities/' + facilityOne.id)).respond(200, facilityOne);
            facilitiesStorage.put.andCallFake(spy);

            offlineService.isOffline.andReturn(false);

            facilityService.get(facilityOne.id).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data.id).toBe(facilityOne.id);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('getAll', function() {

        it('should get all facilities from storage while offline', function() {
            var data;

            facilitiesStorage.getAll.andReturn([facilityOne, facilityTwo]);

            offlineService.isOffline.andReturn(true);

            facilityService.query().then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data[0].id).toBe(facilityOne.id);
            expect(data[1].id).toBe(facilityTwo.id);
        });

        it('should get all facilities and save them to storage', function() {
            var data,
                spy = jasmine.createSpy();

            $httpBackend.when('GET', referencedataUrlFactory('/api/facilities')).respond(200, [facilityOne, facilityTwo]);
            facilitiesStorage.put.andCallFake(spy);

            offlineService.isOffline.andReturn(false);

            facilityService.query().then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data[0].id).toBe(facilityOne.id);
            expect(data[1].id).toBe(facilityTwo.id);
            expect(spy.callCount).toEqual(2);
        });

        it('should get all facilities by id and save them to storage', function() {
            var data,
                spy = jasmine.createSpy(),
                idOne = "id-one",
                idTwo = "id-two";

            $httpBackend
                .when('GET', referencedataUrlFactory('/api/facilities?id=' + idOne + '&id=' + idTwo))
                .respond(200, [facilityOne, facilityTwo]);
            facilitiesStorage.put.andCallFake(spy);

            offlineService.isOffline.andReturn(false);

            facilityService.query({id: [idOne, idTwo]}).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data[0].id).toBe(facilityOne.id);
            expect(data[1].id).toBe(facilityTwo.id);
            expect(spy.callCount).toEqual(2);
        });
    });

    describe('getAllMinimal', function() {

        it('should get all facilities with minimal representation', function() {
            var data;

            $httpBackend.whenGET(new RegExp(referencedataUrlFactory('/api/facilities/minimal.*')))
                .respond(200, {'content': [facilityOne, facilityTwo]});

            facilityService.getAllMinimal().then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data[0].id).toBe(facilityOne.id);
            expect(data[1].id).toBe(facilityTwo.id);
        });

        it('should add sort=name pagination parameter if none provided', function() {
            $httpBackend.whenGET(new RegExp(referencedataUrlFactory('/api/facilities/minimal.*')))
                .respond(200, {'content': [facilityOne, facilityTwo]});

            $httpBackend.expectGET(referencedataUrlFactory('/api/facilities/minimal?sort=name'));

            facilityService.getAllMinimal();

            $httpBackend.flush();
        });
    });

    describe('getUserSupervisedFacilities', function() {
        it('should get supervised facilities from storage while offline', function() {
            var data,
                userId = '1',
                programId = '2',
                rightId = '3';

            facilitiesStorage.search.andReturn([facilityOne]);

            offlineService.isOffline.andReturn(true);

            facilityService.getUserSupervisedFacilities(userId, programId, rightId).then(function(response) {
                data = response;
            });

            $rootScope.$apply();

            expect(data[0].id).toBe(facilityOne.id);
        });

        it('should get supervised facilities and save them to storage', function() {
            var data,
                userId = '1',
                programId = '2',
                rightId = '3';

            $httpBackend.when('GET', referencedataUrlFactory('api/users/' + userId + '/supervisedFacilities?programId=' + programId + '&rightId=' + rightId)).respond(200, [facilityOne, facilityTwo]);

            offlineService.isOffline.andReturn(false);

            facilityService.getUserSupervisedFacilities(userId, programId, rightId).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data[0].id).toBe(facilityOne.id);
            expect(data[1].id).toBe(facilityTwo.id);
            expect(facilitiesStorage.put.callCount).toEqual(2);
        });
    });

    describe('getFulfillmentFacilities', function() {

        var userId, url;

        beforeEach(function() {
            userId = 'user-id';
            url = referencedataUrlFactory('/api/users/' + userId + '/fulfillmentFacilities');

            $httpBackend.when('GET', url).respond(200, [facilityOne]);
        });

        it('should make correct request', function() {
            $httpBackend.expectGET(url);

            facilityService.getFulfillmentFacilities({
                userId: userId
            });
            $httpBackend.flush();
        });

        it('should resolve to facility list', function() {
            var result;

            facilityService.getFulfillmentFacilities({
                userId: userId
            }).then(function(facilities) {
                result = facilities;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.length).toEqual(1);
            expect(result[0].id).toEqual(facilityOne.id);
            expect(result[0].name).toEqual(facilityOne.name);
        });

    });

    describe('search', function() {

        var page, size, name, url;

        beforeEach(function() {
            page = 0;
            size = 2;
            name = 'facility';
            url = referencedataUrlFactory('/api/facilities/search?page=' + page + '&size=' + size);

            $httpBackend.when('POST', url)
                .respond(200, {content: [facilityOne, facilityTwo]});
        });

        it('should make correct request', function() {
            $httpBackend.expectPOST(url);

            facilityService.search({
                page: page,
                size: size
            }, {
                name: name
            });
            $httpBackend.flush();
        });

        it('should resolve to facility list', function() {
            var result;

            facilityService.search({
                page: page,
                size: size
            }, {
                name: name
            }).then(function(paginatedObject) {
                result = paginatedObject;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.content.length).toEqual(2);
            expect(result.content).toEqual([facilityOne, facilityTwo]);
        });
    });

    describe('save', function() {

        it('should save new facility', function() {
            facilityOne.id = undefined;
            $httpBackend.expectPOST(referencedataUrlFactory('/api/facilities'), facilityOne)
                .respond(200, facilityOne);

            var result;

            facilityService.save(facilityOne).then(function(facility) {
                result = facility;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(facilityOne));
        });

        it('should update existing facility', function() {
            $httpBackend.expectPUT(referencedataUrlFactory('/api/facilities/' + facilityOne.id), facilityOne)
                .respond(200, facilityOne);

            var result;

            facilityService.save(facilityOne).then(function(facility) {
                result = facility;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(facilityOne));
        });
    });

    describe('getUserFacilitiesForRight', function() {

        beforeEach(inject(function(permissionService, $q) {
            var permissions = [{
                right: 'example',
                facilityId: '1',
                programId: 'program-1'
            }, {
                right: 'example',
                facilityId: '1',
                programId: 'program-2'
            }, {
                right: 'example',
                facilityId: '2',
                programId: 'program-1'
            }, {
                right: 'test',
                facilityId: '2'
            }];

            var facilities = [
                facilityOne,
                facilityTwo
            ];

            spyOn(permissionService, 'load').andReturn($q.resolve(permissions));
            spyOn(facilityService, 'getAllMinimal').andReturn($q.resolve(facilities));
        }));

        it('should reject if a userId is not specified', function() {
            var resultSpy = jasmine.createSpy('spy');

            facilityService.getUserFacilitiesForRight()
            .catch(resultSpy);

            $rootScope.$apply();

            expect(resultSpy).toHaveBeenCalled();
        });

        it('should reject if a right is not specified', function() {
            var resultSpy = jasmine.createSpy('spy');

            facilityService.getUserFacilitiesForRight('userId')
            .catch(resultSpy);

            $rootScope.$apply();

            expect(resultSpy).toHaveBeenCalled();
        });

        it('should get permissions for user', inject(function(permissionService) {
            facilityService.getUserFacilitiesForRight('userId', 'right');

            $rootScope.$apply();

            expect(permissionService.load).toHaveBeenCalledWith('userId');
        }));

        it('will only return facilities that are associated with the right', function() {
            var results;

            facilityService.getUserFacilitiesForRight('userId', 'example')
            .then(function(facilities) {
                results = facilities;
            });
            $rootScope.$apply();

            expect(results.length).toBe(2);
            expect(results[0].id).toBe('1');

            results = undefined;
            facilityService.getUserFacilitiesForRight('userId', 'test')
            .then(function(facilities) {
                results = facilities;
            });
            $rootScope.$apply();

            expect(results.length).toBe(1);
            expect(results[0].id).toBe('2');
        });

        it('will sort the returned facilities alphebetically by name', function() {
            var results;

            facilityTwo.name = "Another Facility"; // This name should make facility 2 first
            facilityService.getUserFacilitiesForRight('userId', 'example').then(function(facilities) {
                results = facilities
            });
            $rootScope.$apply();

            expect(results.length).toBe(2);
            expect(results[0].name).toBe('Another Facility');
        });

        it('will add program ids into facility.supportedPrograms array', function() {
            var results;

            facilityService.getUserFacilitiesForRight('userId', 'example').then(function(facilities) {
                results = facilities
            });
            $rootScope.$apply();

            expect(results[0].id).toBe('1');
            expect(Array.isArray(results[0].supportedPrograms)).toBe(true);
            expect(results[0].supportedPrograms.length).toBe(2);
            expect(results[0].supportedPrograms[0].id).toBe('program-1');
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});
