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
     * @name referencedata-facility.QUANTITY_UNIT_DISPLAY_OPTIONS
     *
     * @description
     * Single source of the facility-level "Quantity Display Unit" dropdown options, shared by the
     * facility add and view screens so the contract stays in sync. The values mirror the
     * openlmis-quantity-unit-toggle QUANTITY_UNIT constant (PACKS/DOSES/BOTH) and are stored in
     * Facility.extraData.quantityUnitDisplay; they are kept as literals here so this module does not
     * have to depend on the toggle module. An undefined value means "use the system default".
     */
    angular
        .module('referencedata-facility')
        .constant('QUANTITY_UNIT_DISPLAY_OPTIONS', [
            {
                value: undefined,
                messageKey: 'adminFacilityAdd.quantityUnitDisplay.systemDefault'
            }, {
                value: 'PACKS',
                messageKey: 'adminFacilityAdd.quantityUnitDisplay.packsOnly'
            }, {
                value: 'DOSES',
                messageKey: 'adminFacilityAdd.quantityUnitDisplay.dosesOnly'
            }, {
                value: 'BOTH',
                messageKey: 'adminFacilityAdd.quantityUnitDisplay.packsAndDoses'
            }
        ]);

})();
