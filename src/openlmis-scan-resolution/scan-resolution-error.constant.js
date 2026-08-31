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
     * @ngdoc object
     * @name openlmis-scan-resolution.SCAN_RESOLUTION_ERROR
     *
     * @description
     * Why a scan could not be applied to a screen. Codes rather than message keys: the wording belongs
     * to the screen that embedded the scan input, which maps these through the strategy's `messages`.
     *
     * - `PRODUCT_NOT_AVAILABLE` - the trade item is registered, but no product on this screen carries it
     * - `PRODUCT_AMBIGUOUS`     - more than one product on this screen carries it
     * - `LOT_NOT_AVAILABLE`     - the batch is not on this screen and this workflow cannot add one
     * - `LOT_REQUIRED`          - the product is tracked by batch and the barcode carries none
     */
    angular
        .module('openlmis-scan-resolution')
        .constant('SCAN_RESOLUTION_ERROR', {
            PRODUCT_NOT_AVAILABLE: 'PRODUCT_NOT_AVAILABLE',
            PRODUCT_AMBIGUOUS: 'PRODUCT_AMBIGUOUS',
            LOT_NOT_AVAILABLE: 'LOT_NOT_AVAILABLE',
            LOT_REQUIRED: 'LOT_REQUIRED'
        });

})();
