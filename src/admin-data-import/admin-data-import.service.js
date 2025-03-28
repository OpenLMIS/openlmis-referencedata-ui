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
     * @ngdoc service
     * @name admin-data-import.adminDataImport
     *
     * @description
     * Communicates with the /api/serverConfiguration endpoint of the OpenLMIS server.
     */
    angular
        .module('admin-data-import')
        .service('adminDataImport', service);

    service.$inject = ['$resource', 'openlmisUrlFactory'];

    function service($resource, openlmisUrlFactory) {
        var resource = $resource(openlmisUrlFactory('/api/serverConfiguration/'), {}, {
            importData: {
                url: openlmisUrlFactory('/api/importData'),
                method: 'POST',
                headers: {
                    'Content-Type': undefined
                }
            }
        });

        this.importData = importData;
        this.urlFactory = urlFactory;

        function importData(file) {
            var formData = new FormData();
            formData.append('file', file);

            return resource.importData(formData).$promise;
        }

        function urlFactory(url) {
            return openlmisUrlFactory(url);
        }
    }
})();
