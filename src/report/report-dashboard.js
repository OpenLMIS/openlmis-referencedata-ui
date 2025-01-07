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
     * @name report.ReportDashboard
     *
     * @description
     * Represents a single ReportDashboard.
     */
    angular
        .module('report')
        .factory('ReportDashboard', ReportDashboard);

    function ReportDashboard() {

        return ReportDashboard;

        /**
         * @ngdoc method
         * @methodOf report.ReportDashboard
         * @name ReportDashboard
         *
         * @description
         * Creates a new instance of the ReportDashboard class.
         *
         * @param  {String}  id                 the id
         * @param  {String}  name               the report category name
         * @param  {String}  url                the report category url
         * @param  {String}  type               the report category type
         * @param  {Boolean}  showOnHomePage    the report category visible on home page
         * @param  {Object}  category           the category of the report dashboard to be created
         * @param  {Boolean}  enabled           the report category enabled
         * @return {ReportDashboard}            the ReportDashboard object
         */
        function ReportDashboard(id, name, url, type, showOnHomePage, enabled, category) {
            this.id = id;
            this.name = name;
            this.url = url;
            this.type = type;
            this.showOnHomePage = showOnHomePage;
            this.category = category;
            this.enabled = enabled;
        }

    }

})();
