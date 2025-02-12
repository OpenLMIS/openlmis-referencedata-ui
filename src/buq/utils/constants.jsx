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

// Add constants alphabetically
export const FIELD_REQUIRED_TOOLTIP = 'This field is required';

export const BUQ_STATUS = {
  AUTHORIZED: 'AUTHORIZED',
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  REJECTED: 'REJECTED',
};

export const RIGHT_NAME = {
  AUTHORIZE_FORECASTING: 'AUTHORIZE_FORECASTING',
  CREATE_FORECASTING: 'CREATE_FORECASTING'
}

export const PREPARE_BUQ_STATUSES = [
  BUQ_STATUS.DRAFT,
  BUQ_STATUS.SUBMITTED,
  BUQ_STATUS.REJECTED,
];
export const CREATE_AUTHORIZE_FORECASTING_STATUSES = PREPARE_BUQ_STATUSES;

export const STORAGE_ACCESS_TOKEN_NAME = "openlmis.ACCESS_TOKEN";
export const STORAGE_HOME_FACILITY_KEY = "openlmis.homeFacility";
export const STORAGE_SOURCE_OF_FUND_NAME = "openlmis.sourceOfFundForm";
export const STORAGE_SOURCE_OF_FUND_FINANCE_NAME =
  'openlmis.sourceOfFundFinance';
export const STORAGE_USER_ID_NAME = "openlmis.USER_ID"
export const STORAGE_USER_PROGRAMS_NAME = "openlmis.userPrograms";
export const STORAGE_USER_RIGHTS_NAME = "openlmis.ROLE_ASSIGNMENTS";
export const STORAGE_MOH_APPROVAL_PARAMS = "openlmis.MOH_APPROVAL_PARAMS";
const systemCurrencySymbol = '@@CURRENCY_SYMBOL'
export const BUQ_CURRENCY = systemCurrencySymbol.substr(0, 2) !== '@@' ? systemCurrencySymbol : '$';
