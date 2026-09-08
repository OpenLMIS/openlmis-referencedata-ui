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
     * @name openlmis-gtin-scan-input.component:openlmisGtinScanInput
     *
     * @description
     * Wraps the openlmis-gs1 scan input and resolves the scanned GTIN to a registered trade item,
     * reporting both to the handler. Failures to resolve are reported through the scan input's own
     * indicator, so a screen does not have to surface them itself.
     */
    angular
        .module('openlmis-gtin-scan-input')
        .component('openlmisGtinScanInput', {
            controller: 'OpenlmisGtinScanInputController',
            controllerAs: 'vm',
            templateUrl: 'openlmis-gtin-scan-input/openlmis-gtin-scan-input.html',
            bindings: {
                mode: '@',
                context: '<?',
                onScan: '&'
            }
        });

})();
