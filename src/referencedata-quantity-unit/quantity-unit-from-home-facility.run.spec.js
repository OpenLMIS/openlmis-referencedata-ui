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

describe('referencedata-quantity-unit run', function() {

    var loginServiceSpy, facilityFactory, quantityUnitConfigService, authorizationService,
        offlineService, currentUserService, facilityResource, userPreferenceService,
        $rootScope, $q, QUANTITY_UNIT;

    function setUp(config) {
        config = config || {};

        loginServiceSpy = jasmine.createSpyObj('loginService', [
            'registerPostLoginAction', 'registerPostLogoutAction'
        ]);
        quantityUnitConfigService = jasmine.createSpyObj('quantityUnitConfigService', [
            'setMode', 'resetMode', 'getMode', 'setSelectedUnit'
        ]);
        quantityUnitConfigService.getMode.andReturn(config.mode || 'BOTH');
        authorizationService = jasmine.createSpyObj('authorizationService', ['isAuthenticated']);
        authorizationService.isAuthenticated.andReturn(!!config.authenticated);
        facilityFactory = jasmine.createSpyObj('facilityFactory', ['getUserHomeFacility']);
        offlineService = jasmine.createSpyObj('offlineService', ['isOffline']);
        offlineService.isOffline.andReturn(!!config.offline);
        currentUserService = jasmine.createSpyObj('currentUserService', ['getUserInfo']);
        facilityResource = jasmine.createSpyObj('FacilityResource', ['get']);
        userPreferenceService = jasmine.createSpyObj('userPreferenceService', ['get', 'save']);
        QUANTITY_UNIT = {
            PACKS: 'PACKS',
            DOSES: 'DOSES',
            BOTH: 'BOTH'
        };

        module('referencedata-quantity-unit', function($provide) {
            $provide.value('loginService', loginServiceSpy);
            $provide.value('facilityFactory', facilityFactory);
            $provide.value('quantityUnitConfigService', quantityUnitConfigService);
            $provide.value('authorizationService', authorizationService);
            $provide.value('offlineService', offlineService);
            $provide.value('currentUserService', currentUserService);
            $provide.value('FacilityResource', function() {
                return facilityResource;
            });
            $provide.value('userPreferenceService', userPreferenceService);
            $provide.value('QUANTITY_UNIT', QUANTITY_UNIT);
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            currentUserService.getUserInfo.andReturn($q.when(
                config.user || {
                    id: 'user-1',
                    homeFacilityId: 'home-1'
                }
            ));
        });
    }

    function getLastCallArg(method) {
        return method.calls[method.calls.length - 1].args[0];
    }

    function triggerLogin() {
        getLastCallArg(loginServiceSpy.registerPostLoginAction)();
        $rootScope.$apply();
    }

    describe('registration', function() {

        beforeEach(function() {
            setUp();
        });

        it('should register a post login action', function() {
            expect(loginServiceSpy.registerPostLoginAction).toHaveBeenCalled();
        });

        it('should register a post logout action', function() {
            expect(loginServiceSpy.registerPostLogoutAction).toHaveBeenCalled();
        });

        it('should not apply on bootstrap when the user is not authenticated', function() {
            expect(quantityUnitConfigService.resetMode).not.toHaveBeenCalled();
            expect(currentUserService.getUserInfo).not.toHaveBeenCalled();
        });
    });

    describe('post login action (online)', function() {

        beforeEach(function() {
            setUp();
        });

        it('should fetch the home facility FRESH and set the mode from its extra data', function() {
            facilityResource.get.andReturn($q.when({
                extraData: {
                    quantityUnitDisplay: 'PACKS'
                }
            }));
            quantityUnitConfigService.getMode.andReturn('PACKS');

            triggerLogin();

            expect(quantityUnitConfigService.resetMode).toHaveBeenCalled();
            expect(facilityResource.get).toHaveBeenCalledWith('home-1');
            expect(facilityFactory.getUserHomeFacility).not.toHaveBeenCalled();
            expect(quantityUnitConfigService.setMode).toHaveBeenCalledWith('PACKS');
        });

        it('should restore the user selected unit from the server when mode is BOTH', function() {
            facilityResource.get.andReturn($q.when({
                extraData: {
                    quantityUnitDisplay: 'BOTH'
                }
            }));
            quantityUnitConfigService.getMode.andReturn('BOTH');
            userPreferenceService.get.andReturn($q.when({
                quantityUnit: 'PACKS'
            }));

            triggerLogin();

            expect(userPreferenceService.get).toHaveBeenCalledWith('user-1');
            expect(quantityUnitConfigService.setSelectedUnit).toHaveBeenCalledWith('PACKS');
        });

        it('should NOT restore the selected unit when the facility forces a single mode', function() {
            facilityResource.get.andReturn($q.when({
                extraData: {
                    quantityUnitDisplay: 'DOSES'
                }
            }));
            quantityUnitConfigService.getMode.andReturn('DOSES');

            triggerLogin();

            expect(userPreferenceService.get).not.toHaveBeenCalled();
            expect(quantityUnitConfigService.setSelectedUnit).not.toHaveBeenCalled();
        });

        it('should not set the selected unit when the server has no stored preference', function() {
            facilityResource.get.andReturn($q.when({
                extraData: {
                    quantityUnitDisplay: 'BOTH'
                }
            }));
            quantityUnitConfigService.getMode.andReturn('BOTH');
            userPreferenceService.get.andReturn($q.when({}));

            triggerLogin();

            expect(userPreferenceService.get).toHaveBeenCalled();
            expect(quantityUnitConfigService.setSelectedUnit).not.toHaveBeenCalled();
        });

        it('should resolve (not block login) when the user has no home facility', function() {
            currentUserService.getUserInfo.andReturn($q.when({ id: 'user-1' }));

            var resolved = false;
            getLastCallArg(loginServiceSpy.registerPostLoginAction)().then(function() {
                resolved = true;
            });
            $rootScope.$apply();

            expect(facilityResource.get).not.toHaveBeenCalled();
            expect(quantityUnitConfigService.setMode).not.toHaveBeenCalled();
            expect(resolved).toBe(true);
        });

        it('should resolve (not block login) when the fresh fetch fails', function() {
            facilityResource.get.andReturn($q.reject('error'));

            var resolved = false;
            getLastCallArg(loginServiceSpy.registerPostLoginAction)().then(function() {
                resolved = true;
            });
            $rootScope.$apply();

            expect(quantityUnitConfigService.resetMode).toHaveBeenCalled();
            expect(quantityUnitConfigService.setMode).not.toHaveBeenCalled();
            expect(resolved).toBe(true);
        });
    });

    describe('post login action (offline)', function() {

        beforeEach(function() {
            setUp({ offline: true });
        });

        it('should fall back to the cached home facility and NOT fetch fresh or hit the server',
            function() {
                facilityFactory.getUserHomeFacility.andReturn($q.when({
                    extraData: {
                        quantityUnitDisplay: 'BOTH'
                    }
                }));
                quantityUnitConfigService.getMode.andReturn('BOTH');

                triggerLogin();

                expect(facilityFactory.getUserHomeFacility).toHaveBeenCalled();
                expect(facilityResource.get).not.toHaveBeenCalled();
                expect(quantityUnitConfigService.setMode).toHaveBeenCalledWith('BOTH');
                expect(userPreferenceService.get).not.toHaveBeenCalled();
            });
    });

    describe('persisting the selected unit', function() {

        beforeEach(function() {
            setUp();
        });

        it('should save the selected unit per user when the selection event fires', function() {
            userPreferenceService.save.andReturn($q.when({}));

            $rootScope.$emit('openlmis.quantityUnit.selected', 'PACKS');
            $rootScope.$apply();

            expect(userPreferenceService.save).toHaveBeenCalledWith('user-1', {
                quantityUnit: 'PACKS'
            });
        });
    });

    describe('post logout action', function() {

        beforeEach(function() {
            setUp();
        });

        it('should reset the mode', function() {
            getLastCallArg(loginServiceSpy.registerPostLogoutAction)();

            expect(quantityUnitConfigService.resetMode).toHaveBeenCalled();
        });
    });

    describe('on bootstrap when already authenticated', function() {

        it('should apply the home facility mode on bootstrap without waiting for a login',
            function() {
                setUp({
                    authenticated: true,
                    offline: true
                });
                facilityFactory.getUserHomeFacility.andReturn($q.when({
                    extraData: {
                        quantityUnitDisplay: 'DOSES'
                    }
                }));

                $rootScope.$apply();

                expect(quantityUnitConfigService.resetMode).toHaveBeenCalled();
                expect(quantityUnitConfigService.setMode).toHaveBeenCalledWith('DOSES');
            });
    });

});
