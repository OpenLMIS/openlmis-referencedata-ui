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

(function() {

    'use strict';

    /**
     * @ngdoc function
     * @name referencedata-quantity-unit.run:setQuantityUnitFromHomeFacility
     *
     * @description
     * Applies the current user's home facility quantity unit display configuration
     * (extraData.quantityUnitDisplay) to the shared quantityUnitConfigService. The mode is reset
     * first so a user without facility-level configuration does not inherit the previous user's
     * mode. It runs after login, and also on app bootstrap when a session already exists (e.g. a
     * full page reload), because post-login actions only fire on an actual login. On logout the
     * mode is reset so the next user starts from the build-time default.
     *
     * When online the home facility is fetched fresh (via FacilityResource, bypassing the shared
     * facilityService cache which is intentionally aggressive for performance) so an admin's
     * facility-level configuration change is picked up on the user's next login. When offline it
     * falls back to the cached home facility (last-known configuration). Only this module reads the
     * facility fresh - the shared facility cache and its performance characteristics are untouched.
     *
     * Note: on a hard reload the apply is asynchronous (fire-and-forget) while consumers read the
     * mode synchronously once, so a deep-linked page may briefly render in the default mode until
     * the home facility resolves; in practice this is short.
     */
    angular
        .module('referencedata-quantity-unit')
        .run(run);

    run.$inject = [
        '$q', '$rootScope', 'loginService', 'facilityFactory', 'quantityUnitConfigService',
        'authorizationService', 'offlineService', 'currentUserService', 'FacilityResource',
        'userPreferenceService', 'QUANTITY_UNIT'
    ];

    function run($q, $rootScope, loginService, facilityFactory, quantityUnitConfigService,
                 authorizationService, offlineService, currentUserService, FacilityResource,
                 userPreferenceService, QUANTITY_UNIT) {

        loginService.registerPostLoginAction(applyQuantityUnitConfig);
        loginService.registerPostLogoutAction(resetQuantityUnitMode);
        $rootScope.$on('openlmis.quantityUnit.selected', persistSelectedUnit);

        if (authorizationService.isAuthenticated()) {
            applyQuantityUnitConfig();
        }

        function applyQuantityUnitConfig() {
            quantityUnitConfigService.resetMode();

            return getUser()
                .then(function(user) {
                    return getHomeFacility(user)
                        .then(function(homeFacility) {
                            var mode = homeFacility && homeFacility.extraData
                                ? homeFacility.extraData.quantityUnitDisplay
                                : undefined;

                            if (mode) {
                                quantityUnitConfigService.setMode(mode);
                            }

                            return restoreSelectedUnit(user);
                        });
                })
                .catch(function() {
                    // No home facility / user, or it could not be fetched - keep the default mode
                    // and do not block login (matches the other post-login actions' convention).
                    return undefined;
                });
        }

        function getUser() {
            if (offlineService.isOffline()) {
                return $q.resolve(undefined);
            }
            return currentUserService.getUserInfo();
        }

        function getHomeFacility(user) {
            if (offlineService.isOffline()) {
                return facilityFactory.getUserHomeFacility();
            }

            if (!user || !user.homeFacilityId) {
                return $q.reject();
            }

            return new FacilityResource().get(user.homeFacilityId);
        }

        // In BOTH mode the unit the user last selected is their per-user default, so it has to
        // survive logout (which clears local storage). It is persisted server-side per user and
        // restored here on the next login. Forced modes ignore the selection, so skip the fetch.
        // Offline we cannot reach the server, so the last-known local value (if any) is kept.
        function restoreSelectedUnit(user) {
            if (offlineService.isOffline()
                || quantityUnitConfigService.getMode() !== QUANTITY_UNIT.BOTH
                || !user || !user.id) {
                return undefined;
            }

            return userPreferenceService.get(user.id)
                .then(function(preferences) {
                    if (preferences && preferences.quantityUnit) {
                        quantityUnitConfigService.setSelectedUnit(preferences.quantityUnit);
                    }
                })
                .catch(function() {
                    return undefined;
                });
        }

        function persistSelectedUnit(event, unit) {
            return currentUserService.getUserInfo()
                .then(function(user) {
                    if (user && user.id) {
                        return userPreferenceService.save(user.id, {
                            quantityUnit: unit
                        });
                    }
                    return undefined;
                })
                .catch(function() {
                    return undefined;
                });
        }

        function resetQuantityUnitMode() {
            quantityUnitConfigService.resetMode();
            return undefined;
        }
    }

})();
