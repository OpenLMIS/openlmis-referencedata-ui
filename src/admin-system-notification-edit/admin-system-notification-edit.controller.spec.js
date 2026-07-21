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

describe('AdminSystemNotificationEditController', function() {

    beforeEach(function() {
        module('admin-system-notification-edit', function($provide) {
            $provide.service('notificationService', function() {
                return jasmine.createSpyObj('notificationService', ['success', 'error']);
            });
        });

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.SystemNotificationDataBuilder = $injector.get('SystemNotificationDataBuilder');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.SystemNotificationResource = $injector.get('SystemNotificationResource');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$state = $injector.get('$state');
            this.systemNotificationService = $injector.get('systemNotificationService');
        });

        this.author = new this.UserDataBuilder().buildReferenceDataUserJson();
        this.systemNotification = new this.SystemNotificationDataBuilder().build();
        this.successNotificationKey = 'successNotification.key';
        this.errorNotificationKey = 'errorNotification.key';

        spyOn(this.SystemNotificationResource.prototype, 'create').andReturn(this.$q.resolve(this.systemNotification));
        spyOn(this.SystemNotificationResource.prototype, 'update').andReturn(this.$q.resolve(this.systemNotification));
        spyOn(this.$state, 'go').andReturn();
        spyOn(this.systemNotificationService, 'clearCachedSystemNotifications');

        this.initController = function() {
            this.vm = this.$controller('AdminSystemNotificationEditController', {
                author: this.author,
                systemNotification: this.systemNotification,
                successNotificationKey: this.successNotificationKey,
                errorNotificationKey: this.errorNotificationKey
            });
            this.vm.$onInit();
        };
    });

    describe('$onInit', function() {

        beforeEach(function() {
            this.initController();
        });

        it('should expose systemNotification', function() {
            expect(this.vm.systemNotification).toEqual(this.systemNotification);
        });

        it('should expose author', function() {
            expect(this.vm.author).toEqual(this.author);
        });

    });

    describe('saveSystemNotification', function() {

        it('should create new system notification if notification has no ID', function() {
            this.systemNotification = new this.SystemNotificationDataBuilder()
                .withoutId()
                .build();

            this.initController();
            this.vm.saveSystemNotification();

            expect(this.SystemNotificationResource.prototype.create).toHaveBeenCalled();
            expect(this.SystemNotificationResource.prototype.update).not.toHaveBeenCalled();
        });

        it('should update existing notification if notification has ID', function() {
            this.initController();
            this.vm.saveSystemNotification();

            expect(this.SystemNotificationResource.prototype.update).toHaveBeenCalled();
            expect(this.SystemNotificationResource.prototype.create).not.toHaveBeenCalled();
        });

        it('should resolve if saving was successful', function() {
            this.initController();

            var resolved;
            this.vm.saveSystemNotification()
                .then(function() {
                    resolved = true;
                });
            this.$rootScope.$apply();

            expect(resolved).toEqual(true);
        });

        it('should reject if saving failed', function() {
            this.SystemNotificationResource.prototype.update.andReturn(this.$q.reject());
            this.initController();

            var rejected;
            this.vm.saveSystemNotification()
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);

        });

        it('should redirect to the parent state on success', function() {
            this.initController();
            this.vm.saveSystemNotification();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalledWith('.^', {}, {
                reload: true
            });
        });

        it('should clear the cached system notifications on success', function() {
            this.initController();
            this.vm.saveSystemNotification();
            this.$rootScope.$apply();

            expect(this.systemNotificationService.clearCachedSystemNotifications).toHaveBeenCalled();
        });

        it('should not clear the cached system notifications when saving fails', function() {
            this.SystemNotificationResource.prototype.update.andReturn(this.$q.reject());
            this.initController();
            this.vm.saveSystemNotification();
            this.$rootScope.$apply();

            expect(this.systemNotificationService.clearCachedSystemNotifications).not.toHaveBeenCalled();
        });

    });

});