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
     * @ngdoc filter
     * @name admin-role-form.filter:right
     *
     * @description
     * Parses the given right name into more user-friendly string.
     *
     * @param   {Object} rightName the right name to be formatted
     * @return  {String}           the formated right name
     *
     * @example
     * In the HTML:
     * ```
     * <td>{{right.name | right}}</td>
     * ```
     * In the JS:
     * ```
     * $filter('right')(right.name);
     * ```
     */
    angular
        .module('admin-role-form')
        .filter('right', roleRightFilter);

    roleRightFilter.$inject = ['messageService', '$filter', 'ROLE_TYPES'];

    function roleRightFilter(messageService, $filter, ROLE_TYPES) {
        return function(rightName, roleType) {
            if (!rightName) {
                return undefined;
            }

            if (roleType === ROLE_TYPES.REPORTS) {
                return createReportRightName(rightName);
            }

            return messageService.get('adminRoleForm.' + $filter('camelCase')(rightName));
        };
    }

    /**
     * @ngdoc method
     * @methodOf admin-role-form.filter:right
     * @name createReportRightName
     * 
     * @description
     * Formats the given right name into more user-friendly string. First, it replaces all underscores. Then, it
     * lowercases the string, splits it by spaces, capitalizes the first letter of each word, and joins them back.
     */
    function createReportRightName(rightName) {
        return rightName
            .replace(/_/g, ' ')
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

})();
