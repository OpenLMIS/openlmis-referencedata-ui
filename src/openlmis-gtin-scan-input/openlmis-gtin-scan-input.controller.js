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
     * @ngdoc controller
     * @name openlmis-gtin-scan-input.controller:OpenlmisGtinScanInputController
     *
     * @description
     * Resolves a scanned GTIN to a trade item and hands both to the handler.
     */
    angular
        .module('openlmis-gtin-scan-input')
        .controller('OpenlmisGtinScanInputController', OpenlmisGtinScanInputController);

    OpenlmisGtinScanInputController.$inject = ['$q', 'tradeItemService'];

    function OpenlmisGtinScanInputController($q, tradeItemService) {

        var vm = this;

        vm.resolve = resolve;

        /**
         * @ngdoc method
         * @methodOf openlmis-gtin-scan-input.controller:OpenlmisGtinScanInputController
         * @name resolve
         *
         * @description
         * Looks the scanned GTIN up and passes the scan and its trade item on to the handler. The
         * returned promise is what the scan input reports on, so the indicator only turns green once
         * the handler itself has succeeded.
         *
         * @param  {Object}  scan    the parsed scan
         * @param  {String}  mode    the scan mode
         * @param  {Object}  context the screen's context object
         * @return {Promise}         resolves when the handler does, rejects with a message key
         */
        function resolve(scan, mode, context) {
            return lookUp(scan)
                .then(function(tradeItem) {
                    return vm.onScan({
                        scan: scan,
                        tradeItem: tradeItem,
                        mode: mode,
                        context: context
                    });
                });
        }

        // Rejections are relabelled to message keys.
        function lookUp(scan) {
            if (!scan.gtin) {
                return $q.reject('openlmisGtinScanInput.noGtin');
            }

            return tradeItemService.getByGtin(scan.gtin)
                .catch(function() {
                    return $q.reject('openlmisGtinScanInput.gtinLookupFailed');
                })
                .then(function(tradeItem) {
                    return tradeItem || $q.reject('openlmisGtinScanInput.gtinNotRegistered');
                });
        }
    }

})();
