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

describe('SystemNotificationsIndicatorController', function() {

    beforeEach(function() {
        module('openlmis-system-notifications-indicator');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$controller = $injector.get('$controller');
            this.systemNotificationService = $injector.get('systemNotificationService');
            this.SystemNotificationDataBuilder = $injector.get('SystemNotificationDataBuilder');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.ObjectReferenceDataBuilder = $injector.get('ObjectReferenceDataBuilder');
            this.offlineService = $injector.get('offlineService');
        });

        this.users = [
            new this.UserDataBuilder().buildReferenceDataUserJson(),
            new this.UserDataBuilder().buildReferenceDataUserJson()
        ];

        this.systemNotifications = [
            new this.SystemNotificationDataBuilder()
                .withAuthor(
                    new this.ObjectReferenceDataBuilder()
                        .withId(this.users[0].id)
                        .build()
                )
                .build(),
            new this.SystemNotificationDataBuilder()
                .withAuthor(
                    new this.ObjectReferenceDataBuilder()
                        .withId(this.users[1].id)
                        .build()
                )
                .build(),
            new this.SystemNotificationDataBuilder()
                .withAuthor(
                    new this.ObjectReferenceDataBuilder()
                        .withId(this.users[1].id)
                        .build()
                )
                .build(),
            new this.SystemNotificationDataBuilder()
                .withAuthor(
                    new this.ObjectReferenceDataBuilder()
                        .withId(this.users[0].id)
                        .build()
                )
                .build()
        ];

        spyOn(this.systemNotificationService, 'getSystemNotifications')
            .andReturn(this.$q.resolve(this.systemNotifications));

        spyOn(this.offlineService, 'isOffline');

        this.vm = this.$controller('SystemNotificationsIndicatorController');
        this.vm.$onInit();
    });

    describe('$onInit', function() {

        it('should expose system notifications', function() {
            this.$rootScope.$apply();

            expect(this.vm.systemNotifications).toEqual(this.systemNotifications);
        });

        it('should not resolve system notifications while offline', function() {
            this.offlineService.isOffline.andReturn(true);
            this.vm.$onInit();

            expect(this.vm.systemNotifications).toEqual(undefined);
        });

    });

    describe('on state change', function() {

        it('should re-read system notifications after navigation', function() {
            this.$rootScope.$apply();
            this.systemNotificationService.getSystemNotifications.reset();

            this.$rootScope.$broadcast('$stateChangeSuccess');
            this.$rootScope.$apply();

            expect(this.systemNotificationService.getSystemNotifications).toHaveBeenCalled();
        });

        it('should update the exposed notifications after navigation', function() {
            this.$rootScope.$apply();

            var refreshed = [this.systemNotifications[0]];
            this.systemNotificationService.getSystemNotifications
                .andReturn(this.$q.resolve(refreshed));

            this.$rootScope.$broadcast('$stateChangeSuccess');
            this.$rootScope.$apply();

            expect(this.vm.systemNotifications).toEqual(refreshed);
        });

        it('should not re-read system notifications while offline', function() {
            this.$rootScope.$apply();
            this.systemNotificationService.getSystemNotifications.reset();
            this.offlineService.isOffline.andReturn(true);

            this.$rootScope.$broadcast('$stateChangeSuccess');
            this.$rootScope.$apply();

            expect(this.systemNotificationService.getSystemNotifications).not.toHaveBeenCalled();
        });

    });

});