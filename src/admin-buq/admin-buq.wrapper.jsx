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
        .module('admin-buq')
        .directive('adminBuq', adminBuq);

        adminBuq.$inject = ['loadingModalService'];

    function adminBuq(loadingModalService) {
        return {
            template: '<div id="adminBuq" class="admin-buq"></div>',
            replace: true,
            link: function () {
                const app = document.getElementById('adminBuq');

                ReactDOM.render(
                    <>
                        <Routing
                            loadingModalService={loadingModalService}
                        />
                        <ToastContainer theme='colored'/>
                    </>,
                    app
                );
            }
        };
    }
})();
