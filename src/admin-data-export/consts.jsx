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
        value: "Program",
        name: "Program"
    }
];

export const DATA_EXPORT = [
        {
            "type": "Program", 
            "id": "Orderables.csv",
            "name": "Orderables.csv"
        },
        {
            "type": "Program", 
            "id": "OrderableIdentifiers.csv",
            "name": "OrderableIdentifiers.csv"
        },
        {
            "type": "Program", 
            "id": "ProgramOrderables.csv",
            "name": "ProgramOrderables.csv"
        },
        {
            "type": "Program", 
            "id": "TradeItems.csv",
            "name": "TradeItems.csv"
        }
];

// TODO - use the data returned from backend API, when backend is ready this const must be removed
export const MOCKED_ZIP_STRING = `UEsDBBQAAAAAAGt6M1YAAAAAAAAAAAAAAAAJACAAemlwX2ZpbGUvVVQNAAdrUcljflHJY2tRyWN1eA
sAAQTpAwAABOkDAABQSwMEFAAIAAgAVXozVgAAAAAAAAAAIwAAABIAIAB6aXBfZmlsZS9maWxlMS5jc3ZVVA0AB0NRyWNDUclj
a1HJY3V4CwABBOkDAAAE6QMAAEtMKU4pTkwpLk5JVEiEshMVgDwIC4i4AFBLBwifQs6LGAAAACMAAABQSwECFAMUAAAAAABrej
NWAAAAAAAAAAAAAAAACQAgAAAAAAAAAAAA/UEAAAAAemlwX2ZpbGUvVVQNAAdrUcljflHJY2tRyWN1eAsAAQTpAwAABOkDAABQ
SwECFAMUAAgACABVejNWn0LOixgAAAAjAAAAEgAgAAAAAAAAAAAAtIFHAAAAemlwX2ZpbGUvZmlsZTEuY3N2VVQNAAdDUcljQ1
HJY2tRyWN1eAsAAQTpAwAABOkDAABQSwUGAAAAAAIAAgC3AAAAvwAAAAAA`;

export const ZIP_NAME = "export_results.zip";
