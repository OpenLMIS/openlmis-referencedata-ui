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

import React, { useEffect, useState } from 'react';

import Select from '../../../react-components/inputs/select';
import MultiSelect from '../MultiSelect';
import { DATA_EXPORT, TYPE_OF_EXPORTS, MOCKED_ZIP_STRING, ZIP_NAME } from '../../consts';
import { download } from '../../utils';

const AdminDataExportPage = ({ offlineService }) => {

    const menu = document.getElementsByClassName('header ng-scope')[0];
    const [typeOfExport, setTypeOfExport] = useState("");
    const [optionsForDatas, setOptionsForDatas] = useState(DATA_EXPORT);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const toggleOption = ({ id }) => {
      setSelectedFiles(prevSelected => {
        const newArray = [...prevSelected]
        if (newArray.includes(id)) {
            return newArray.filter(item => item != id)
        } else {
            newArray.push(id)
            return newArray;
        }
      })
    }

    const downloadZip = () => {
      if (selectedFiles.length > 0) {
        setTypeOfExport("");
        setSelectedFiles([]);
        download(ZIP_NAME, MOCKED_ZIP_STRING);
      }
    };

    useEffect(() => menu.style.display = '', [menu]);

    useEffect(() => {
      if (typeOfExport) {
        setOptionsForDatas(prevOptionsForFiles => {
          const newOptionsForFiles = [...DATA_EXPORT];
          return newOptionsForFiles.filter(
            data => data.type === typeOfExport
          );
        });
      } else {
        setTypeOfExport("");
        setOptionsForDatas(DATA_EXPORT);
      }
    }, [typeOfExport]);

    return (
        <>
            <div>
                <h2 id='data-export-header'>
                  Data Export
                </h2>
                <div className='required' style={{marginBottom: '4px', fontFamily: 'Arial', fontSize: '16px'}}>
                  <label id='type-header'>
                    Type
                  </label>
                </div>
                <div className='field-full-width' style={{marginBottom: '16px', width: '40%'}}>
                    <Select
                      options={TYPE_OF_EXPORTS}
                      onChange={value => {
                        setSelectedFiles([]);
                        setTypeOfExport(value);
                      }}
                      value={typeOfExport}
                    />
                </div>

                <div className='required' style={{marginBottom: '4px', fontFamily: 'Arial', fontSize: '16px'}}>
                  <label id='type-header'>
                    Data
                  </label>
                </div>
                <div className='field-full-width' style={{marginBottom: '16px', width: '40%'}}>
                    <MultiSelect
                      options={optionsForDatas}
                      selected={selectedFiles}
                      toggleOption={toggleOption}
                      disabled={!typeOfExport}
                    />
                </div>
            </div>
            <div className="openlmis-toolbar">
                <button 
                  className='primary'
                  type='button'
                  style={{ marginTop: '0.5em' }}
                  disabled={selectedFiles.length === 0}
                  onClick={downloadZip}
                >
                  Export
                </button>
            </div>
        </>
    )
};

export default AdminDataExportPage;
