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

    angular.module('admin-geographic-zone-visualize').config(routes);

    routes.$inject = ['modalStateProvider', 'ADMINISTRATION_RIGHTS'];

    function routes(modalStateProvider, ADMINISTRATION_RIGHTS) {

        modalStateProvider.state('openlmis.administration.geographicZones.visualize', {
            controller: 'GeographicZoneVisualizeController',
            controllerAs: 'vm',
            templateUrl: 'admin-geographic-zone-visualize/geographic-zone-visualize.html',
            url: '/geographicZones/visualize/:id',
            accessRights: [ADMINISTRATION_RIGHTS.GEOGRAPHIC_ZONES_MANAGE],
            resolve: {
                geographicZone: function(geographicZoneService, $stateParams) {
                    return geographicZoneService.get($stateParams.id);
                },
                childGeographicZones: function(geographicZoneService, geographicZone) {
                    return geographicZoneService.search({
                        parent: geographicZone.id,
                        sort: 'name'
                    }).then(function(response) {
                        return response.content;
                    });
                }
            },
            parentResolves: []
        });
    }
})();
