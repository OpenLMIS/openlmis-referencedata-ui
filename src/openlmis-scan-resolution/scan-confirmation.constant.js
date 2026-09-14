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
     * @name openlmis-scan-resolution.SCAN_CONFIRMATION
     *
     * @description
     * What a screen may be asked to acknowledge before a scan is applied. The resolution service asks
     * whenever the situation arises; whether that becomes a dialog is the screen's decision, so a
     * workflow where the situation is routine can accept silently.
     *
     * - `NEW_LOT`         the batch has no record yet and is about to be added
     * - `EXPIRY_MISMATCH` the label and the recorded batch disagree on the expiry date
     */
    angular
        .module('openlmis-scan-resolution')
        .constant('SCAN_CONFIRMATION', {
            NEW_LOT: 'NEW_LOT',
            EXPIRY_MISMATCH: 'EXPIRY_MISMATCH'
        });

})();
