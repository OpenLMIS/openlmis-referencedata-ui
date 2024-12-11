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

import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import getService from '../../../react-components/utils/angular-utils';
import Select from '../../../react-components/inputs/select';
import Loading from '../../../react-components/modals/loading';
import {TYPE_OF_IMPORTS} from '../../consts';

const AdminDataImportPage = () => {

    const [typeOfImport, setTypeOfImport] = useState('');
    const [selectedFile, setSelectedFile] = useState('');
    const [displayLoading, setDisplayLoading] = useState(false);

    const serverService = useMemo(
        () => {
            return getService('adminDataImport');
        },
        []
    );

    const { formatMessage } = useMemo(() => getService('messageService'), []);

    const importZip = () => {
        if (selectedFile) {
            setDisplayLoading(true);
            serverService.importData(selectedFile)
                .then(() => toast.success(formatMessage('admin.dataImport.toast.success')))
                .finally(() => {
                    setSelectedFile('');
                    setTypeOfImport('');
                    setDisplayLoading(false);
                });
        }
    }

    const FileUploader = () => {
        const hiddenFileInput = React.useRef(null);

        const handleClick = () => {
            hiddenFileInput.current.click();
        };

        const handleChange = event => {
            const fileUploaded = event.target.files[0];
            setSelectedFile(fileUploaded);
        };

        return (
            <>
                {!selectedFile &&
                    <>
                        <button
                            className='file-upload-button'
                            onClick={handleClick}
                            disabled={!typeOfImport}
                        >
                            {formatMessage('admin.dataImport.selectFile')}
                        </button>
                        <input
                        style={{display: 'none'}}
                        ref={hiddenFileInput}
                        type='file'
                        onChange={handleChange}
                        disabled={!typeOfImport}
                        accept=".zip, .rar, .7z"
                        />
                    </>
                }
                {selectedFile &&
                    <div className='input-import-file'>
                        <input
                            type='text'
                            value={selectedFile.name}
                        />
                        <button type='button'>
                            <i className="fa-duotone fa-xmark"></i>
                            <i
                                className='fa fa-times clear-icon clear clear-button'
                                onClick={() => setSelectedFile('')}
                            />
                        </button>
                    </div>
                }
            </>
        );
    }

    return (
        <>
            <div>
                <h2 id='data-export-header'>
                  {formatMessage('admin.dataImport.label')}
                </h2>
                <div className='required' style={{marginBottom: '4px', fontFamily: 'Arial', fontSize: '16px'}}>
                  <label id='type-header'>
                    {formatMessage('admin.dataImport.type')}
                  </label>
                </div>
                <div className='field-full-width' style={{marginBottom: '16px', width: '40%'}}>
                    <Select
                      options={TYPE_OF_IMPORTS}
                      onChange={value => {
                        setSelectedFile('');
                        setTypeOfImport(value);
                      }}
                      value={typeOfImport}
                    />
                    {TYPE_OF_IMPORTS.map(type => {
                        if(type.value === typeOfImport){
                            return <p style={{maxWidth: '544px'}} key={type.value}>{type.info}</p>
                        }
                    })}
                </div>
                <div className='required' style={{marginBottom: '4px', fontFamily: 'Arial', fontSize: '16px'}}>
                  <label id='type-header'>
                   {formatMessage('admin.dataImport.zipFile')}
                  </label>
                </div>
                <div className='field-full-width' style={{marginBottom: '16px', width: '40%'}}>
                    <FileUploader />
                </div>
            </div>
            <div className="openlmis-toolbar">
                <button
                  className='primary'
                  type='button'
                  style={{ marginTop: '0.5em' }}
                  disabled={selectedFile.length === 0}
                  onClick={importZip}
                >
                  {formatMessage('admin.dataImport.import')}
                </button>
            </div>
            {displayLoading &&
              <Loading/>
            }
        </>
    )
};

export default AdminDataImportPage;
