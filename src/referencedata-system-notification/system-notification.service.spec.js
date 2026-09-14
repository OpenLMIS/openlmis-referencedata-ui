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

describe('systemNotificationService', function() {
    beforeEach(function() {
        module('referencedata-system-notification');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.systemNotificationService = $injector.get('systemNotificationService');
            this.SystemNotificationResource = $injector.get('SystemNotificationResource');
            this.$rootScope = $injector.get('$rootScope');
            this.localStorageService = $injector.get('localStorageService');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.SystemNotificationDataBuilder = $injector.get('SystemNotificationDataBuilder');
            this.ObjectReferenceDataBuilder = $injector.get('ObjectReferenceDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.localStorageKey = 'systemNotifications';

        this.systemNotifications = [
            new this.SystemNotificationDataBuilder()
                .withoutExpiryDate()
                .build(),
            new this.SystemNotificationDataBuilder()
                .withoutExpiryDate()
                .build()
        ];

        this.systemNotificationsPage = new this.PageDataBuilder()
            .withContent(this.systemNotifications)
            .build();

        spyOn(this.SystemNotificationResource.prototype, 'query')
            .andReturn(this.$q.resolve(this.systemNotificationsPage));

        spyOn(this.localStorageService, 'get');
        spyOn(this.localStorageService, 'remove');
        spyOn(this.localStorageService, 'add');
    });

    describe('getSystemNotifications', function() {

        it('should return list of active system notifications', function() {
            var result;
            this.systemNotificationService.getSystemNotifications()
                .then(function(notifications) {
                    result = notifications;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.systemNotifications);
        });

        it('should return cached data if available', function() {
            this.localStorageService.get.andReturn(angular.toJson(this.systemNotifications));

            var result;
            this.systemNotificationService.getSystemNotifications()
                .then(function(notifications) {
                    result = notifications;
                });
            this.$rootScope.$apply();

            expect(this.localStorageService.get).toHaveBeenCalledWith(this.localStorageKey);
            expect(this.SystemNotificationResource.prototype.query).not.toHaveBeenCalled();
            expect(result).toEqual(this.systemNotifications);
        });

        it('should fetch system notifications with correct params', function() {
            this.systemNotificationService.getSystemNotifications();
            this.$rootScope.$apply();

            expect(this.SystemNotificationResource.prototype.query).toHaveBeenCalledWith({
                isDisplayed: true,
                expand: 'author'
            });
        });

        it('should reject if fetching system notifications fails', function() {
            this.SystemNotificationResource.prototype.query.andReturn(this.$q.reject());

            var rejected;
            this.systemNotificationService.getSystemNotifications()
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should not return inactive notifications', function() {
            var active = new this.SystemNotificationDataBuilder()
                .withoutExpiryDate()
                .build();
            var inactive = new this.SystemNotificationDataBuilder()
                .withoutExpiryDate()
                .inactive()
                .build();

            this.SystemNotificationResource.prototype.query.andReturn(this.$q.resolve(
                new this.PageDataBuilder()
                    .withContent([active, inactive])
                    .build()
            ));

            var result;
            this.systemNotificationService.getSystemNotifications()
                .then(function(notifications) {
                    result = notifications;
                });
            this.$rootScope.$apply();

            expect(result).toEqual([active]);
        });

        it('should not return notifications that have already expired', function() {
            var displayed = new this.SystemNotificationDataBuilder()
                .withoutExpiryDate()
                .build();
            var expired = new this.SystemNotificationDataBuilder()
                .withExpiryDate('2000-01-01T00:00:00.000Z')
                .build();

            this.SystemNotificationResource.prototype.query.andReturn(this.$q.resolve(
                new this.PageDataBuilder()
                    .withContent([displayed, expired])
                    .build()
            ));

            var result;
            this.systemNotificationService.getSystemNotifications()
                .then(function(notifications) {
                    result = notifications;
                });
            this.$rootScope.$apply();

            expect(result).toEqual([displayed]);
        });

        it('should not return notifications that have not started yet', function() {
            var displayed = new this.SystemNotificationDataBuilder()
                .withoutExpiryDate()
                .build();
            var notStarted = new this.SystemNotificationDataBuilder()
                .withoutExpiryDate()
                .withStartDate('2999-01-01T00:00:00.000Z')
                .build();

            this.SystemNotificationResource.prototype.query.andReturn(this.$q.resolve(
                new this.PageDataBuilder()
                    .withContent([displayed, notStarted])
                    .build()
            ));

            var result;
            this.systemNotificationService.getSystemNotifications()
                .then(function(notifications) {
                    result = notifications;
                });
            this.$rootScope.$apply();

            expect(result).toEqual([displayed]);
        });

    });

    describe('clearCachedSystemNotifications', function() {

        it('should clear cache', function() {
            this.systemNotificationService.getSystemNotifications();
            this.$rootScope.$apply();

            expect(this.SystemNotificationResource.prototype.query.callCount).toEqual(1);

            this.systemNotificationService.clearCachedSystemNotifications();
            this.systemNotificationService.getSystemNotifications();
            this.$rootScope.$apply();

            expect(this.localStorageService.remove).toHaveBeenCalledWith(this.localStorageKey);
            expect(this.SystemNotificationResource.prototype.query.callCount).toEqual(2);
        });

    });
});