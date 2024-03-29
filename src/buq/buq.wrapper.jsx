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

import React from 'react';
import ReactDOM from 'react-dom';
import Routing from './Routing';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

(function () {
    'use strict';

    angular
        .module('buq')
        .directive('buq', buq);

    buq.$inject = ['loadingModalService', 'facilityService', 'periodService', 'orderableService'];

    function buq(loadingModalService, facilityService, periodService, orderableService) {
        return {
            template: '<div id="buq" class="buq"></div>',
            replace: true,
            link: function () {
                const app = document.getElementById('buq');
                ReactDOM.render(
                    <>
                        <Routing
                            loadingModalService={loadingModalService}
                            facilityService={facilityService}
                            periodService={periodService}
                            orderableService={orderableService}
                        />
                        <ToastContainer theme='colored' />
                    </>
                    , app);
            }
        };
    }
})();
