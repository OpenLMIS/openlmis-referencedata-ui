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
     * @name referencedata-user.UserRepositoryImpl
     *
     * @description
     * Default implementation of the UserRepository interface. Responsible for combining server responses into single
     * object to be passed to the User class constructor.
     */
    angular
        .module('referencedata-user')
        .factory('UserRepositoryImpl', UserRepositoryImpl);

    UserRepositoryImpl.inject = ['ReferenceDataUserResource', 'UserContactDetailsResource', 'AuthUserResource', '$q'];

    function UserRepositoryImpl(ReferenceDataUserResource, UserContactDetailsResource, AuthUserResource, $q) {

        UserRepositoryImpl.prototype.get = get;
        UserRepositoryImpl.prototype.query = query;
        UserRepositoryImpl.prototype.create = create;
        UserRepositoryImpl.prototype.update = update;

        return UserRepositoryImpl;

        /**
         * @ngdoc method
         * @methodOf referencedata-user.UserRepositoryImpl
         * @name UserRepositoryImpl
         * @constructor
         *
         * @description
         * Creates an object of the UserRepositoryImpl class and initiates all required dependencies.
         */
        function UserRepositoryImpl() {
            this.referenceDataUserResource = new ReferenceDataUserResource();
            this.userContactDetailsResource = new UserContactDetailsResource();
            this.authUserResource = new AuthUserResource();
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user.UserRepositoryImpl
         * @name create
         *
         * @description
         * Creates a new user on the OpenLMIS server.
         *
         * @param  {Object}  user the instance of the User class
         * @return {Promise}      the promise resolving to combined JSON which can be used for creating instance of the
         *                        User class
         */
        function create(user) {
            var authUserResource = this.authUserResource,
                userContactDetailsResource = this.userContactDetailsResource;

            return this.referenceDataUserResource
                .update(user.getBasicInformation())
                .then(function(referenceDataUser) {
                    user.id = referenceDataUser.id;
                    return $q.all([
                        authUserResource.create(user.getAuthDetails()),
                        userContactDetailsResource.update(user.getContactDetails())
                    ]).then(function(responses) {
                        return combineResponses(referenceDataUser, responses[1]);
                    });
                });
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user.UserRepositoryImpl
         * @name update
         *
         * @description
         * Updates the user on the OpenLMIS server.
         *
         * @param  {Object}  user the instance of the User class
         * @return {Promise}      the promise resolving to combined JSON which can be used for creating instance of the
         *                        User class
         */
        function update(user) {
            return $q.all([
                this.referenceDataUserResource.update(user.getBasicInformation()),
                this.userContactDetailsResource.update(user.getContactDetails())
            ]).then(function(responses) {
                var referenceDataUser = responses[0],
                    userContactDetails = responses[1];

                return combineResponses(referenceDataUser, userContactDetails);
            });
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user.UserRepositoryImpl
         * @name get
         *
         * @description
         * Retrieves the user with the given ID from the OpenLMIS server.
         *
         * @param  {String}  id the id of the user
         * @return {Promise}    the promise resolving to combined JSON which can be used for creating instance of the
         *                      User class
         */
        function get(id) {
            return $q.all([
                this.referenceDataUserResource.get(id),
                this.userContactDetailsResource.query({
                    id: [id]
                })
            ]).then(function(responses) {
                var referenceDataUser = responses[0],
                    userContactDetails = responses[1].content.length ? responses[1].content[0] : undefined;

                return combineResponses(referenceDataUser, userContactDetails);
            });
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-user.UserRepositoryImpl
         * @name query
         *
         * @description
         * Retrieves the users matching the given parameters from the OpenLMIS server.
         *
         * @param  {Object}  params the parameters to search with
         * @return {Promise}        the promise resolving to a page of combined JSON which can be used for creating
         *                          instances of the User class
         */
        function query(params) {
            var referenceDataUserResource = this.referenceDataUserResource;
            if (params && params.email) {
                return this.userContactDetailsResource.query({
                    email: params.email
                }).then(function(userContactDetailsPage) {
                    var ids = userContactDetailsPage.content.map(function(userContactDetails) {
                        return userContactDetails.referenceDataUserId;
                    });

                    if (ids.length) {
                        params.id = ids;
                        return referenceDataUserResource.query(params)
                            .then(function(referenceDataUserPage) {
                                return combinePages(referenceDataUserPage, userContactDetailsPage);
                            });
                    }
                    return userContactDetailsPage;
                });
            }

            var userContactDetailsResource = this.userContactDetailsResource;
            return this.referenceDataUserResource.query(params)
                .then(function(referenceDataUserPage) {
                    var ids = referenceDataUserPage.content.map(function(user) {
                        return user.id;
                    });

                    if (ids.length) {
                        return userContactDetailsResource.query({
                            id: ids
                        }).then(function(userContactDetailsPage) {
                            return combinePages(referenceDataUserPage, userContactDetailsPage);
                        });
                    }
                    return referenceDataUserPage;
                });
        }

        function combinePages(referenceDataUserPage, userContactDetailsPage) {
            referenceDataUserPage.content = referenceDataUserPage.content.map(function(referenceDataUser) {
                var userContactDetails = userContactDetailsPage.content.filter(function(userContactDetails) {
                    return userContactDetails.referenceDataUserId === referenceDataUser.id;
                })[0];
                return combineResponses(referenceDataUser, userContactDetails);
            });
            return referenceDataUserPage;
        }

        function combineResponses(referenceDataUser, userContactDetails) {
            if (userContactDetails) {
                referenceDataUser.phoneNumber = userContactDetails.phoneNumber;
                referenceDataUser.email = userContactDetails.emailDetails.email;
                referenceDataUser.verified = userContactDetails.emailDetails.emailVerified;
                referenceDataUser.allowNotify = userContactDetails.allowNotify;
                referenceDataUser.hasContactDetails = true;
            }

            return referenceDataUser;
        }

    }

})();