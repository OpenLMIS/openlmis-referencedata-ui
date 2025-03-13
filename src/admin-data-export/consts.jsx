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

export const TYPE_OF_EXPORTS = [
    {
        value: "Product",
        name: "admin.dataExport.types.products"
    },
    {
        value: "Facility",
        name: "admin.dataExport.types.facilities"
    },
    {
        value: 'Population',
        name: 'admin.dataExport.types.population'
    },
    {
        value: 'User',
        name: 'admin.dataExport.types.users'
    }
];

export const DATA_EXPORT = [
        {
            "type": "Product",
            "id": "orderable.csv",
            "name": "orderable.csv"
        },
        {
            "type": "Product",
            "id": "orderableIdentifier.csv",
            "name": "orderableIdentifier.csv"
        },
        {
            "type": "Product",
            "id": "programOrderable.csv",
            "name": "programOrderable.csv"
        },
        {
            "type": "Product",
            "id": "tradeItem.csv",
            "name": "tradeItem.csv"
        },
        {
            "type": "Facility",
            "id": "facility.csv",
            "name": "facility.csv"
        },
        {
            "type": "Facility",
            "id": "supportedProgram.csv",
            "name": "supportedProgram.csv"
        },
        {
            "type": "Population",
            "id": "geographicZone.csv",
            "name": "geographicZone.csv"
        },
        {
            "type": "User",
            "id": "user.csv",
            "name": "user.csv"
        }
];
