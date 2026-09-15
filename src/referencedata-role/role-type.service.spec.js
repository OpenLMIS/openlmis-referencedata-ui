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

describe('roleTypeService', function() {

    beforeEach(function() {
        module('referencedata-role');

        inject(function($injector) {
            this.roleTypeService = $injector.get('roleTypeService');
            this.RoleDataBuilder = $injector.get('RoleDataBuilder');
            this.ROLE_TYPES = $injector.get('ROLE_TYPES');
        });

        this.consoleError = spyOn(console, 'error');
    });

    describe('getType', function() {

        it('should return the type of the first right', function() {
            var role = new this.RoleDataBuilder()
                .withRight({
                    type: this.ROLE_TYPES.SUPERVISION
                })
                .build();

            expect(this.roleTypeService.getType(role)).toEqual(this.ROLE_TYPES.SUPERVISION);
        });

        it('should return undefined if the rights array is empty', function() {
            expect(this.roleTypeService.getType(new this.RoleDataBuilder().build())).toBeUndefined();
        });

        it('should return undefined if the rights array is missing', function() {
            expect(this.roleTypeService.getType({
                name: 'role-without-rights'
            })).toBeUndefined();
        });

        it('should return undefined if the role is undefined', function() {
            expect(this.roleTypeService.getType(undefined)).toBeUndefined();
        });

        it('should return undefined if the role is null', function() {
            expect(this.roleTypeService.getType(null)).toBeUndefined();
        });

        it('should log a role that has no rights', function() {
            this.roleTypeService.getType(new this.RoleDataBuilder().build());

            expect(this.consoleError).toHaveBeenCalled();
        });

        it('should not log a role that has rights', function() {
            this.roleTypeService.getType(new this.RoleDataBuilder()
                .withRight({
                    type: this.ROLE_TYPES.SUPERVISION
                })
                .build());

            expect(this.consoleError).not.toHaveBeenCalled();
        });
    });
});
