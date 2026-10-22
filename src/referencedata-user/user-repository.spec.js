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

describe('UserRepository', function() {

    beforeEach(function() {
        module('referencedata-user');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.UserRepository = $injector.get('UserRepository');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
        });

        this.impl = jasmine.createSpyObj('impl', ['updateRoleAssignments']);
        this.userRepository = new this.UserRepository(this.impl);
        this.user = new this.UserDataBuilder().build();
    });

    describe('updateRoleAssignments', function() {

        it('should delegate to the implementation', function() {
            var promise = this.$q.resolve();
            this.impl.updateRoleAssignments.andReturn(promise);

            expect(this.userRepository.updateRoleAssignments(this.user)).toBe(promise);
            expect(this.impl.updateRoleAssignments).toHaveBeenCalledWith(this.user);
        });

    });

});
