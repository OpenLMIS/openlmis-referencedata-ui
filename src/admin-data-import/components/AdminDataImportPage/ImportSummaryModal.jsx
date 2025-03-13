import React, { useMemo, useState } from 'react';
import TabNavigation from '../../../react-components/tab-navigation/tab-navigation.jsx';
import Modal from '../../../react-components/modals/Modal.jsx'
import getService from '../../../react-components/utils/angular-utils';
import { IMPORT_SUMMARY_HEADER_TRANSLATION_PREFIX } from '../../consts.jsx';

export default function ImportSummaryModal({ results }) {
    const { formatMessage } = useMemo(() => getService('messageService'), []);
    const [currentTab, setCurrentTab] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const currentResult = results[currentTab];
    const hasErrors = currentResult.failedEntriesCount > 0 && currentResult.errors?.length;

    const onClose = () => {
        setIsModalOpen(false);
        window.location.reload();
    };

    if (!results || !results.length) { return null; }

    return (
        <>
            <Modal
                isOpen={isModalOpen}
            >

                <>
                    <div className='react-modal-header'>
                        <span className='modal-title'>
                            {formatMessage('admin.dataImport.modal.summary')}
                        </span>
                    </div>
                    <div className='react-modal-body' id='import-summary-modal-body'>
                        <TabNavigation
                            config={{
                                data: results.map((file, index) => ({
                                    header: file.fileName,
                                    key: file.fileName,
                                    isActive: currentTab === index
                                })),
                                onTabChange: setCurrentTab
                            }}
                        />

                        <div className='import-summary'>
                            <p>
                                {formatMessage('admin.dataImport.modal.totalEntries')}: <strong>{currentResult.totalEntriesCount}</strong>
                            </p>
                            <p className='success'>
                                {formatMessage('admin.dataImport.modal.successfulEntries')}: <strong>{currentResult.successfulEntriesCount}</strong>
                            </p>
                            <p className='error'>
                                {formatMessage('admin.dataImport.modal.failedEntries')}: <strong>{currentResult.failedEntriesCount}</strong>
                            </p>
                        </div>

                        {hasErrors && (
                            <table className='failed-entries-table'>
                                <thead>
                                    <tr>
                                        {currentResult.errors.length > 0 &&
                                            Object.keys(currentResult.errors[0]).map((key, index) => (
                                                key !== 'errors' &&
                                                <th key={index}>{formatMessage(`${IMPORT_SUMMARY_HEADER_TRANSLATION_PREFIX}.${key}`)}</th>
                                            ))}
                                        <th>{formatMessage('admin.dataImport.modal.errors')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentResult.errors.map((error, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {Object.keys(error).map((key, colIndex) => (
                                                key !== "errors" && <td key={colIndex}>{error[key]}</td>
                                            ))}
                                            <td>
                                                <ul>
                                                    {error.errors.map((errMsg, i) => (
                                                        <li key={i}>{formatMessage(errMsg)}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div
                        className='react-modal-footer'
                        style={{
                            flexDirection: 'row-reverse'
                        }}>
                        <button className='btn primary' onClick={onClose}>
                            {formatMessage('admin.dataImport.modal.confirm')}
                        </button>
                    </div>
                </>
            </Modal>
        </>

    )
}
