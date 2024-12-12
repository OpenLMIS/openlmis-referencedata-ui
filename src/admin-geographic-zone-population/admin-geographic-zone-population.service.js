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

    angular
        .module('admin-geographic-zone-population')
        .service('geoZoneCatchmentPopulationService', geoZoneCatchmentPopulationService);

    geoZoneCatchmentPopulationService.$inject = [
        'featureFlagService',
        'GeoLevelResource',
        'CATCHMENT_POPULATION_CALC_AUTO_FEATURE_FLAG'
    ];

    function geoZoneCatchmentPopulationService(
        featureFlagService,
        GeoLevelResource,
        CATCHMENT_POPULATION_CALC_AUTO_FEATURE_FLAG
    ) {
        const isCatchmentPopulationAutoCalc = featureFlagService.get(CATCHMENT_POPULATION_CALC_AUTO_FEATURE_FLAG);
        let lowestLevel = null;

        new GeoLevelResource().getTheLowestGeoLevel()
            .then(function(geoLevel) {
                lowestLevel = geoLevel.levelNumber;
            });

        return {
            isEditable: function(geographicZone) {
                if (isCatchmentPopulationAutoCalc) {
                    // NOTE: Editable only if the geographic zone is at the lowest level.
                    // This only applies when the feature flag is enabled.
                    return geographicZone.level.levelNumber === lowestLevel;
                }

                // NOTE: Every geographic zone is editable when the feature flag is disabled.
                return true;
            },
            isTheLowestLevel: function(geographicZone) {
                return geographicZone.level.levelNumber === lowestLevel;
            }
        };
    }

})();
