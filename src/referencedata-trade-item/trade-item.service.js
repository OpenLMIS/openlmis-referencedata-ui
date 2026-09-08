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
     * @name referencedata-trade-item.tradeItemService
     *
     * @description
     * Responsible for retrieving trade item information from the server.
     */
    angular
        .module('referencedata-trade-item')
        .service('tradeItemService', service);

    service.$inject = ['TradeItemResource', '$q'];

    function service(TradeItemResource, $q) {

        var tradeItemResource = new TradeItemResource();

        this.getByGtin = getByGtin;

        /**
         * @ngdoc method
         * @methodOf referencedata-trade-item.tradeItemService
         * @name getByGtin
         *
         * @description
         * Retrieves the trade item registered with the given GTIN. The backend stores GTINs padded to
         * 14 digits and matches on that form, so a GTIN-8, GTIN-12 or GTIN-13 resolves the same trade
         * item as its 14-digit equivalent, and at most one can match.
         *
         * @param  {String}  gtin the GTIN to look up
         * @return {Promise}      the trade item, or undefined if none is registered with the GTIN;
         *                        rejects if no GTIN was given
         */
        function getByGtin(gtin) {
            if (!gtin) {
                return $q.reject(new Error('gtin must be given'));
            }

            return tradeItemResource
                .query({
                    gtin: gtin
                })
                .then(firstOf);
        }

        function firstOf(page) {
            if (!page || !page.content || !page.content.length) {
                return undefined;
            }

            return page.content[0];
        }
    }

})();
