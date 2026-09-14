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

    angular.module('admin-role-form').config(routes);

    routes.$inject = ['$stateProvider', 'ADMINISTRATION_RIGHTS'];

    function routes($stateProvider, ADMINISTRATION_RIGHTS) {

        $stateProvider.state('openlmis.administration.roles.createUpdate', {
            label: 'adminRoleForm.createUpdateRole',
            accessRights: [ADMINISTRATION_RIGHTS.USERS_MANAGE],
            resolve: {
                role: function($stateParams, referencedataRoleService) {
                    return $stateParams.roleId ? referencedataRoleService.get($stateParams.roleId) : undefined;
                },
                type: function(role, $state, $stateParams, roleTypeService) {
                    if (role) {
                        return roleTypeService.getType(role);
                    }
                    if ($stateParams.type) {
                        return $stateParams.type;
                    }
                    $state.go('openlmis.administration.roles.selectType');
                },
                rights: function($q, role, type, referencedataRightService) {
                    var deferred = $q.defer();

                    referencedataRightService.search(undefined, type).then(function(rights) {
                        angular.forEach(rights, function(right) {
                            right.checked = role && role.rights.filter(function(roleRight) {
                                return right.name === roleRight.name;
                            }).length > 0;
                        });
                        deferred.resolve(rights);
                    }, deferred.reject);

                    return deferred.promise;
                }
            },
            params: {
                type: undefined
            },
            url: '/:roleId',
            views: {
                '@openlmis': {
                    controller: 'RoleFormController',
                    templateUrl: 'admin-role-form/role-form.html',
                    controllerAs: 'vm'
                }
            }
        });

    }
})();
