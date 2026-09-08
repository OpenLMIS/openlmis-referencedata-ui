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

describe('tradeItemService', function() {

    var GTIN = '05890123456786';

    beforeEach(function() {
        var tradeItemService, $rootScope, q, TradeItemResource;

        module('referencedata-trade-item');

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            q = $injector.get('$q');
            TradeItemResource = $injector.get('TradeItemResource');
            tradeItemService = $injector.get('tradeItemService');
        });

        this.$rootScope = $rootScope;
        this.$q = q;
        this.service = tradeItemService;

        this.tradeItem = {
            id: 'trade-item-id',
            gtin: GTIN
        };

        this.querySpy = spyOn(TradeItemResource.prototype, 'query');
    });

    it('should query the endpoint with the gtin filter', function() {
        this.querySpy.andReturn(this.$q.resolve({
            content: [this.tradeItem]
        }));

        this.service.getByGtin(GTIN);
        this.$rootScope.$apply();

        expect(this.querySpy).toHaveBeenCalledWith({
            gtin: GTIN
        });
    });

    it('should resolve with the matching trade item', function() {
        var result;

        this.querySpy.andReturn(this.$q.resolve({
            content: [this.tradeItem]
        }));

        this.service.getByGtin(GTIN).then(function(tradeItem) {
            result = tradeItem;
        });
        this.$rootScope.$apply();

        expect(result).toBe(this.tradeItem);
    });

    it('should resolve with undefined when no trade item is registered with the gtin', function() {
        var result = 'untouched';

        this.querySpy.andReturn(this.$q.resolve({
            content: []
        }));

        this.service.getByGtin(GTIN).then(function(tradeItem) {
            result = tradeItem;
        });
        this.$rootScope.$apply();

        expect(result).toBeUndefined();
    });

    it('should resolve with undefined when the response carries no content', function() {
        var result = 'untouched';

        this.querySpy.andReturn(this.$q.resolve({}));

        this.service.getByGtin(GTIN).then(function(tradeItem) {
            result = tradeItem;
        });
        this.$rootScope.$apply();

        expect(result).toBeUndefined();
    });

    it('should reject without querying when no gtin was given', function() {
        var rejected = false;

        this.service.getByGtin(undefined).catch(function() {
            rejected = true;
        });
        this.$rootScope.$apply();

        expect(rejected).toBe(true);
        expect(this.querySpy).not.toHaveBeenCalled();
    });

    it('should propagate a failed request', function() {
        var rejected = false;

        this.querySpy.andReturn(this.$q.reject('request failed'));

        this.service.getByGtin(GTIN).catch(function() {
            rejected = true;
        });
        this.$rootScope.$apply();

        expect(rejected).toBe(true);
    });

});
