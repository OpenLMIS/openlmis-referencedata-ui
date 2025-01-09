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
     * @name report-category.reportCategoryService
     *
     * @description
     * Responsible for retrieving report category information from server.
     */
    angular
        .module('report-category')
        .service('reportCategoryService', service);

    service.$inject = ['openlmisUrlFactory', '$resource'];

    function service(openlmisUrlFactory, $resource) {

        var resource = $resource(openlmisUrlFactory('/api/reports/reportCategories'), {}, {
            create: {
                method: 'POST',
                url: openlmisUrlFactory('/api/reports/reportCategories')
            },
            update: {
                method: 'PUT',
                url: openlmisUrlFactory('/api/reports/reportCategories/:id')
            },
            getAll: {
                method: 'GET',
                url: openlmisUrlFactory('/api/reports/reportCategories')
            },
            get: {
                method: 'GET',
                url: openlmisUrlFactory('/api/reports/reportCategories/:id')
            },
            remove: {
                method: 'DELETE',
                url: openlmisUrlFactory('/api/reports/reportCategories/:id')
            }
        });

        return {
            create: create,
            update: update,
            getAll: getAll,
            get: get,
            remove: remove
        };

        function create(category) {
            return resource.create(category).$promise;
        }

        function update(category) {
            return resource.update({
                id: category.id
            }, category).$promise;
        }

        function getAll() {
            return resource.getAll().$promise;
        }

        function get(id) {
            return resource.get({
                id: id
            }).$promise;
        }

        function remove(id) {
            return resource.remove({
                id: id
            }).$promise;
        }

    }
})();
