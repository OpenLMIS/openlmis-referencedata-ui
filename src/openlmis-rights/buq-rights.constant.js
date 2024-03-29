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
     * @name openlmis-rights.ADMINISTRATION_RIGHTS
     *
     * @description
     * This is constant for administration rights.
     */
    angular
        .module('openlmis-rights')
        .constant('BUQ_RIGHTS', rights());

    function rights() {
        return {
            PREPARE_BUQ: 'PREPARE_BUQ',
            MANAGE_BUQ: 'MANAGE_BUQ',
            CREATE_FORECASTING: 'CREATE_FORECASTING',
            AUTHORIZE_FORECASTING: 'AUTHORIZE_FORECASTING',
            APPROVE_BUQ: 'APPROVE_BUQ',
            MOH_APPROVAL: 'MOH_APPROVAL',
            PORALG_APPROVAL: 'PORALG_APPROVAL'
        };
    }

})();
