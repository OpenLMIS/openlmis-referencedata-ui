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

    angular
        .module('openlmis-user')
        .config(routes);

    routes.$inject = ['$stateProvider', 'ROLE_TYPES'];

    function routes($stateProvider, ROLE_TYPES) {

        $stateProvider
            .state('openlmis.profile', {
                url: '/profile',
                label: 'openlmisUser.profile',
                templateUrl: 'openlmis-user/user-profile.html',
                controller: 'UserProfileController',
                controllerAs: 'vm',
                resolve: {
                    userId: function(currentUserService) {
                        return currentUserService.getUserInfo()
                            .then(function(user) {
                                return user.id;
                            });
                    },
                    user: function(UserRepository, userId) {
                        return new UserRepository().get(userId);
                    }
                }
            })
            .state('openlmis.profile.basicInformation', {
                url: '/basicInformation',
                templateUrl: 'openlmis-user/user-profile-basic-information.html',
                controller: 'UserProfileBasicInformationController',
                controllerAs: 'vm',
                resolve: {
                    user: function(UserRepository, userId) {
                        return new UserRepository().get(userId);
                    },
                    homeFacility: function(user, facilityService) {
                        if (user.homeFacilityId) {
                            return facilityService.getMinimal(user.homeFacilityId);
                        }
                    },
                    pendingVerificationEmail: function(user, authUserService) {
                        return authUserService.getVerificationEmail(user.id);
                    }
                }
            })
            .state('openlmis.profile.roleAssignments', {
                url: '/roleAssignments?page&size',
                templateUrl: 'openlmis-user/user-profile-role-assignments.html',
                controller: 'UserProfileRoleAssignmentsController',
                controllerAs: 'vm',
                resolve: {
                    roles: function(referencedataRoleFactory) {
                        return referencedataRoleFactory.getAllWithType();
                    },
                    roleRightsMap: function(roles, ObjectMapper) {
                        return new ObjectMapper().map(roles, 'rights');
                    },
                    programs: function(programService) {
                        return programService.getAll();
                    },
                    warehouses: function(facilityService) {
                        return facilityService.getAllMinimal();
                    },
                    facilitiesMap: function(warehouses, ObjectMapper) {
                        return new ObjectMapper().map(warehouses);
                    },
                    supervisoryNodes: function(AdminUserRolesSupervisoryNodeResource, facilitiesMap) {
                        return new AdminUserRolesSupervisoryNodeResource(facilitiesMap).query()
                            .then(function(page) {
                                return page.content;
                            });
                    },
                    user: function(userRoleAssignmentFactory, userId, roles, programs, supervisoryNodes, warehouses) {
                        return userRoleAssignmentFactory
                            .getUser(userId, roles, programs, supervisoryNodes, warehouses);
                    }
                }
            })
            .state('openlmis.profile.notificationSettings', {
                url: '/notificationSettings',
                templateUrl: 'openlmis-user/user-profile-notification-settings.html',
                controller: 'UserProfileNotificationSettingsController',
                controllerAs: 'vm',
                resolve: {
                    digestConfigurations: function(DigestConfigurationResource) {
                        return new DigestConfigurationResource().query()
                            .then(function(digestConfigurationsPage) {
                                return digestConfigurationsPage.content;
                            });
                    },
                    userSubscriptions: function(UserSubscriptionResource, user) {
                        return new UserSubscriptionResource().query({
                            userId: user.id
                        });
                    }
                }
            });

        addStateForRoleType(ROLE_TYPES.ORDER_FULFILLMENT, '/fulfillment', 'user-roles-fulfillment.html');
        addStateForRoleType(ROLE_TYPES.SUPERVISION, '/supervision', 'user-roles-supervision.html');
        addStateForRoleType(ROLE_TYPES.GENERAL_ADMIN, '/admin', 'user-roles-tab.html');
        addStateForRoleType(ROLE_TYPES.REPORTS, '/reports', 'user-roles-tab.html');

        function addStateForRoleType(type, url, templateFile) {
            $stateProvider.state('openlmis.profile.roleAssignments.' + type, {
                url: url,
                controller: 'UserProfileRolesTabController',
                templateUrl: 'admin-user-roles/' + templateFile,
                controllerAs: 'vm',
                resolve: {
                    tab: function() {
                        return type;
                    },
                    roleAssignments: function(paginationService, $stateParams, user, tab) {
                        return paginationService.registerList(null, $stateParams, function() {
                            return user.getRoleAssignments(tab);
                        });
                    }
                }
            });
        }

    }

})();
