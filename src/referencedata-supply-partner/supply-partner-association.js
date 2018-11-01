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
     * @name referencedata-supply-partner.SupplyPartnerAssociation
     *
     * @description
     * Represents a single supply partner association.
     */
    angular
        .module('referencedata-supply-partner')
        .factory('SupplyPartnerAssociation', SupplyPartnerAssociation);

    function SupplyPartnerAssociation() {

        return SupplyPartnerAssociation;

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-partner.SupplyPartnerAssociation
         * @name SupplyPartnerAssociation
         * @constructor
         * 
         * @description
         * Creates an instance of the SupplyPartnerAssociation class.
         * 
         * @param {Object} json the JSON representation of the supply partner association
         */
        function SupplyPartnerAssociation(json) {
            this.program = json.program;
            this.supervisoryNode = json.supervisoryNode;
            this.facilities = json.facilities;
            this.orderables = json.orderables;
        }
    }
})();
