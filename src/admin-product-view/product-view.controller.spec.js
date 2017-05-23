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

describe('ProductViewController', function () {

    var $state, $controller,
        vm, product;

    beforeEach(function() {
        module('admin-product-view');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
        });

        product = {
            id: 'product-id',
            name: 'product-name'
        };

        vm = $controller('ProductViewController', {
            product: product
        });
        vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose goProductList method', function() {
            expect(angular.isFunction(vm.goToProductList)).toBe(true);
        });

        it('should expose product', function() {
            expect(vm.product).toEqual(product);
        });
    });

    describe('goToProductList', function() {

        beforeEach(function() {
            spyOn($state, 'go').andReturn();
            vm.goToProductList();
        });

        it('should call state go with correct params', function() {
            expect($state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });
    });
});
