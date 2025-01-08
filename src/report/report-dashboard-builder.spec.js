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
        .module('report')
        .factory('ReportDashboardDataBuilder', ReportDashboardDataBuilder);

    ReportDashboardDataBuilder.$inject = ['ReportDashboard', 'REPORT_TYPES', 'ReportCategoryDataBuilder'];

    function ReportDashboardDataBuilder(ReportDashboard, REPORT_TYPES, ReportCategoryDataBuilder) {

        ReportDashboardDataBuilder.prototype.build = build;
        ReportDashboardDataBuilder.prototype.withId = withId;
        ReportDashboardDataBuilder.prototype.withName = withName;
        ReportDashboardDataBuilder.prototype.withType = withType;

        return ReportDashboardDataBuilder;

        function ReportDashboardDataBuilder() {
            ReportDashboardDataBuilder.instanceNumber = (ReportDashboardDataBuilder.instanceNumber || 0) + 1;

            this.id = 'report-dashboard-id-' + ReportDashboardDataBuilder.instanceNumber;
            this.name = 'report-dashboard-' + ReportDashboardDataBuilder.instanceNumber;
            this.url = 'report-dashboard-url' + ReportDashboardDataBuilder.instanceNumber;
            this.type = REPORT_TYPES.SUPERSET;
            this.enabled = true;
            this.showOnHomePage = true;
            this.category = new ReportCategoryDataBuilder().build();
        }

        function withName(newName) {
            this.name = newName;
            return this;
        }

        function withId(newId) {
            this.id = newId;
            return this;
        }

        function withType(newType) {
            this.type = newType;
            return this;
        }

        function build() {
            return new ReportDashboard(
                this.id,
                this.name,
                this.url,
                this.type,
                this.enabled,
                this.showOnHomePage,
                this.category
            );
        }
    }

})();
