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
     * @name referencedata-user.UserRepository
     * 
     * @description
     * Repository for managing users used throughout the system.
     */
    angular
        .module('referencedata-user')
        .factory('UserRepository', UserRepository);

    UserRepository.$inject = ['classExtender', 'OpenlmisRepository', 'User', 'UserRepositoryImpl'];

    function UserRepository(classExtender, OpenlmisRepository, User, UserRepositoryImpl) {

        classExtender.extend(UserRepository, OpenlmisRepository);

        UserRepository.prototype.updateRoleAssignments = updateRoleAssignments;

        return UserRepository;

        /**
         * @ngdoc method
         * @methodOf referencedata-user.UserRepository
         * @name updateRoleAssignments
         *
         * @description
         * Updates the role assignments of the given user. Unlike update, the contact details and the auth
         * details are not sent.
         *
         * @param  {Object}  user the instance of the User class
         * @return {Promise}      the promise resolving to the combined user JSON
         */
        function updateRoleAssignments(user) {
            return this.impl.updateRoleAssignments(user);
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user.UserRepository
         * @name UserRepository
         * @constructor
         * 
         * @description
         * Creates an instance of the UserRepository. If no implementation is given a default one will be used.
         * The default implementation is an instance of the UserRepositoryImpl class.
         * 
         * @param {Object} impl the implementation to be used by the repository, defaults to UserRepositoryImpl
         */
        function UserRepository(impl) {
            this.super(User, impl || new UserRepositoryImpl());
        }
    }
})();