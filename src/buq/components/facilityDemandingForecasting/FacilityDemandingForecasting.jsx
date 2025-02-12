import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useFacilityDemandForecasting from '../../../react-hooks/useFacilityDemandForecasting';
import useServerService from '../../../react-hooks/useServerService';
import DetailsBlock from '../../../react-components/DetailsBlock';
import FacilityDemandingForecastingTable from '../facilityDemandingForecastingTable/FacilityDemandingForecastingTable';
import ActionBar from '../../../react-components/ActionBar';
import { useHistory } from 'react-router-dom';
import Modal from '../../../admin-buq/components/Modal/Modal';
import BuqSourceOfFundAddForm from './BuqSourceOfFundAddForm';
import ConfirmModalBody from '../../../react-components/ConfirmModalBody';
import ModalErrorMessage from '../../../react-components/ModalErrorMessage';
import useBuqCommonFuncs from '../../../react-hooks/useBuqCommonFunctions';
import useLocalStorage from '../../../react-hooks/useLocalStorage';
import { STORAGE_SOURCE_OF_FUND_FINANCE_NAME, STORAGE_SOURCE_OF_FUND_NAME, BUQ_STATUS, BUQ_CURRENCY } from '../../utils/constants';
import { isEmpty, objectNotEmpty } from '../../../react-components/utils/helpers';
import { findRegion } from '../../utils/helpers';
import RejectionCommentsForm from './RejectionCommentsForm';

const FacilityDemandingForecasting = ({
    loadingModalService,
    facilityService,
    orderableService,
    isInApproval,
    isInFinalApproval
}) => {
    const getField = (orderable, fieldName) => {
        const orderableProgram = orderable.programs[0];
        return orderableProgram[fieldName];
    };

    const history = useHistory();

    const { id } = useParams();
    const [displaySoFModal, setDisplaySoFModal] = useState(false);
    const [displayRejectModal, setDisplayRejectModal] = useState(false);
    const [rejectionDetails, setRejectionDetails] = useState({
      generalComments: '',
      rejectionReasons: [],
    });
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [displayRejectConfirmationModal, setDisplayRejectConfirmationModal] = useState(false);
    const [displayErrorModal, setDisplayErrorModal] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [buqToSubmit, setBuqToSubmit] = useState(false);
    const [buqToAuthorize, setBuqToAuthorize] = useState(false);
    const [skipAuthorization, setSkipAuthorization] = useState(false);
    const [callSourceOfFundValidation, setCallSourceOfFundValidation] = useState(false);
    const [confirmMessageContent, setConfirmMessageContent] = useState('');
    const [confirmButtonText, setConfirmButtonText] = useState('');
    const [isSourceOfFundInvalid, setIsSourceOfFundInvalid] = useState(false);

    const { buq, lineItems, setLineItems, remarksParams, fundingDetails, fetchDetailedBuq } = useFacilityDemandForecasting(loadingModalService, facilityService, orderableService);
    const { storedItems, handleClearLocalStorage, handleSaveInLocalStorage } = useLocalStorage();
    const { buqProgram } = useBuqCommonFuncs();
    const buqService = useServerService('buqService');
    const isRejected = buq?.status === BUQ_STATUS.REJECTED;

    const getErrors = (row) => {
        const verifiedAAConsumption = row.verifiedAnnualAdjustedConsumption;
        const forecastedDemand = row.forecastedDemand;
        const errors = [];

        if (verifiedAAConsumption === '') {
            errors.push('VERIFIED_CONSUMPTION');
        }

        if (forecastedDemand === '') {
            errors.push('FORECASTED_DEMAND');
        }

        if ((verifiedAAConsumption !== forecastedDemand && !row.remark?.id)) {
            errors.push('REMARK');
        }
        return errors;
    }

    const validateRow = (row) => {
        const errors = getErrors(row);
        row.errors = errors;

        const updatedLineItems = lineItems.map((lineItem) => {
            if (lineItem.id === row.id) {
                return {
                    ...lineItem,
                    errors: errors,
                };
            }
            return lineItem;
        });

        setLineItems(updatedLineItems);
    }

    const isRowValid = (row) => {
        return getErrors(row).length === 0;
    }

    const onRowChange = (key, value, row) => {
        const updatedLineItems = lineItems.map((lineItem) => {
            if (lineItem.id === row.id) {
                const valueToInsert = value ?? '';
                lineItem[key] = valueToInsert;
                if (key === 'verifiedAnnualAdjustedConsumption') {
                    lineItem.forecastedDemand = valueToInsert;
                }
                if (key === 'verifiedAnnualAdjustedConsumption' || key === 'forecastedDemand') {
                    const price = getField(lineItem.orderable, 'pricePerPack');
                    lineItem.totalCost = lineItem.forecastedDemand * (price ?? 0);
                }
                if (key === 'remark') {
                    lineItem.remark = { id: value };
                }
                if (lineItem.verifiedAnnualAdjustedConsumption === lineItem.forecastedDemand && lineItem.remark) {
                    lineItem.remark = null;
                }
                validateRow(lineItem);
            }
            return lineItem;
        });
        setLineItems(updatedLineItems);
    }

    const calculateTotalCost = (lineItems) => {
        const totalCost = lineItems.reduce((prev, lineItem) => {
            const price = getField(lineItem.orderable, 'pricePerPack');
            return prev + lineItem.forecastedDemand * (price ?? 0);
        }, 0);

        setTotalCost(totalCost);
    }

    const backToCreatePage = () => {
        handleClearLocalStorage(STORAGE_SOURCE_OF_FUND_NAME);
        handleClearLocalStorage(STORAGE_SOURCE_OF_FUND_FINANCE_NAME);
        history.push('/buq/create');
    }

    const backToPreviousPage = () => {
        history.goBack();
    }

    const handleSaveAction = () => {
        loadingModalService.open();

        const updatedSourcesOfFunds = !!storedItems.sourcesOfFunds
          ? storedItems.sourcesOfFunds.map((sourceOfFunds) => ({
              sourceOfFund: {
                id: sourceOfFunds.id,
              },
              amountUsedInLastFinancialYear:
                sourceOfFunds.amountUsedInLastFinancialYear,
              projectedFund: sourceOfFunds.projectedFund,
            }))
          : [];

        const updatedFundingDetails = {
            id: fundingDetails.id,
            bottomUpQuantificationId: fundingDetails.bottomUpQuantificationId,
            totalProjectedFund: storedItems.sourceOfFundFinance?.totalProjectedFund,
            totalForecastedCost: Number(totalCost).toFixed(2),
            gap: storedItems.sourceOfFundFinance?.gap,
            sourcesOfFunds: updatedSourcesOfFunds
        }

        buqService.updateBuq(id,
            {
                id: buq.id,
                facilityId: buq.facilityId,
                programId: buq.programId,
                bottomUpQuantificationLineItems: lineItems,
                fundingDetails: updatedFundingDetails
            })
            .then(() => toast.success('The form has been saved successfully'))
            .finally(() => loadingModalService.close());
    }

    const handleApproveAction = (id, payload) => {
        loadingModalService.open();
        buqService.approveBuq(id, payload)
        .then(() => {
            toast.success('The form has been approved successfully');
            backToApprovePage();
        })
        .finally(() => loadingModalService.close());
    }

    const handleFinalApproveAction = (id) => {
        loadingModalService.open();
        buqService.finalApproveBuq([id])
        .then(() => {
            toast.success('The form has been approved successfully');
            backToPreviousPage();
        })
        .finally(() => loadingModalService.close());
    }

    const backToApprovePage = () => {
        history.push('/buq/approve');
    }

    const toggleSoFModal = () => {
        setDisplaySoFModal(!displaySoFModal);
    };

    const toggleRejectModal = () => {
        setDisplayRejectModal((prevState) => !prevState);
    };

    const onCancelRejectionComments = () => {
      setRejectionDetails({
        generalComments: '',
        rejectionReasons: [],
      });
      toggleRejectModal();
    };

    const onSubmitRejectionComments = () => {
      toggleRejectModal();
      setDisplayRejectConfirmationModal((prevState) => !prevState);
    };

    const onCancelRejectionCommentsForm = () => {
      setDisplayRejectConfirmationModal((prevState) => !prevState);
      toggleRejectModal();
    };

    const onSubmitRejectionCommentsForm = async () => {
      loadingModalService.open();
      try {
        await buqService.rejectBuq(buq.id, rejectionDetails);
        toast.success('Forecast has been rejected successfully.');
        backToPreviousPage();
      } catch (error) {
        toast.error('Failed to reject the forecast.');
      } finally {
        setDisplayRejectConfirmationModal((prevState) => !prevState);
        loadingModalService.close();
      }
    };

    const handleSubmitAction = () => {
        setDisplayConfirmationModal(false);

        if (validateSourceOfFund() && validateLineItems()) {
            loadingModalService.open();
            const updatedSourcesOfFunds = storedItems.sourcesOfFunds.map((sourceOfFunds) => ({
                sourceOfFund: {
                    id: sourceOfFunds.id
                },
                amountUsedInLastFinancialYear: sourceOfFunds.amountUsedInLastFinancialYear,
                projectedFund: sourceOfFunds.projectedFund
            }));

            const updatedFundingDetails = {
                id: fundingDetails.id,
                bottomUpQuantificationId: fundingDetails.bottomUpQuantificationId,
                totalProjectedFund: storedItems.sourceOfFundFinance.totalProjectedFund,
                totalForecastedCost: Number(totalCost).toFixed(2),
                gap: storedItems.sourceOfFundFinance.gap,
                sourcesOfFunds: updatedSourcesOfFunds
            }

            const payload = {
                id: buq.id,
                facilityId: buq.facilityId,
                programId: buq.programId,
                processingPeriodId: buq.processingPeriodId,
                createdDate: buq.createdDate,
                modifiedDate: buq.modifiedDate,
                targetYear: buq.targetYear,
                status: buq.status,
                bottomUpQuantificationLineItems: lineItems,
                fundingDetails: updatedFundingDetails,
            };

            if (isInFinalApproval) {
                return handleFinalApproveAction(buq.id);
            }

            if (isInApproval) {
                return handleApproveAction(buq.id, payload);
            }
            if (buqToSubmit) {
                buqService.submitBuq(buq.id, payload)
                    .then(() => {
                        toast.success('The form has been submitted successfully');
                        backToCreatePage();
                    })
                    .finally(() => loadingModalService.close());
            } else if (buqToAuthorize || skipAuthorization) {
                buqService.authorizeBuq(buq.id, payload)
                    .then(() => {
                        toast.success(`The form has been ${skipAuthorization ? 'submitted and' : ''} authorized successfully`);
                        backToCreatePage();
                    })
                    .finally(() => loadingModalService.close());
            }
            return;
        }
        setDisplayErrorModal(true);
        if (!validateSourceOfFund()) {
            setIsSourceOfFundInvalid(true);
            setCallSourceOfFundValidation(true);
        }
    }

    const validateSourceOfFund = () => {
        if (storedItems.sourcesOfFunds) {
            return storedItems.sourcesOfFunds.every((sourcesOfFunds) =>
                Object.values(sourcesOfFunds).every(value => !isEmpty(value))
            )
        }
        return false;
    }

    const validateLineItems = () => {
        return lineItems.every(lineItem =>
            !lineItem.errors.length
        );
    }

    const detailsData = objectNotEmpty(buq) ? [
        [{
            topic: 'Region',
            value: findRegion(buq.facility.geographicZone).name
        },
        {
            topic: 'Council',
            value: buq.facility.geographicZone.name
        },
        {
            topic: 'Facility Type',
            value: buq.facility.type.name
        }],
        [{
            topic: 'Facility Code',
            value: buq.facility.code
        }, {
            topic: 'Facility Name',
            value: buq.facility.name
        },
        {
            topic: 'Quantification Period',
            value: buq.processingPeriod.name
        }
        ]
    ] : [];

    useEffect(() => {
        fetchDetailedBuq(id).finally(() => loadingModalService.close());
    }, []);

    useEffect(() => {
        setTableData(lineItems);
        calculateTotalCost(lineItems);
    }, [lineItems]);

    useEffect(() => {
        if (fundingDetails.sourcesOfFunds.length) {
            const sourcesOfFunds = fundingDetails.sourcesOfFunds.map((sourceOfFund) => ({
                id: sourceOfFund.sourceOfFund.id,
                indicatedSourceOfFund: sourceOfFund.sourceOfFund.name,
                amountUsedInLastFinancialYear: sourceOfFund.amountUsedInLastFinancialYear,
                amountUsedInLastFinancialYearIsValid: true,
                projectedFund: sourceOfFund.projectedFund,
                projectedFundIsValid: true,
            }));
            handleSaveInLocalStorage(STORAGE_SOURCE_OF_FUND_NAME, sourcesOfFunds);
            handleSaveInLocalStorage(STORAGE_SOURCE_OF_FUND_FINANCE_NAME, {
                totalProjectedFund: fundingDetails.totalProjectedFund,
                gap: fundingDetails.gap
            });
        }

        return () => {
            if (fundingDetails.sourcesOfFunds.length) {
              handleClearLocalStorage(STORAGE_SOURCE_OF_FUND_NAME);
              handleClearLocalStorage(STORAGE_SOURCE_OF_FUND_FINANCE_NAME);
            }
          };
    }, [fundingDetails])

    useEffect(() => {
        if (isInApproval) {
            setSkipAuthorization(false)
            setBuqToAuthorize(false)
            setConfirmMessageContent('approve')
            setConfirmButtonText('Approve')
            return;
        }
        if (buqProgram.skipAuthorization) {
            setSkipAuthorization(true)
            setBuqToSubmit(false)
            setBuqToAuthorize(false)
            setConfirmMessageContent('submit and authorize')
            setConfirmButtonText('Submit & Authorize')
            return;
        }
        if (buq.status === BUQ_STATUS.DRAFT || buq.status === BUQ_STATUS.REJECTED) {
            setSkipAuthorization(false)
            setBuqToSubmit(true)
            setConfirmMessageContent('submit')
            setConfirmButtonText('Submit')
            return;
        }
        if (buq.status === BUQ_STATUS.SUBMITTED) {
            setSkipAuthorization(false)
            setBuqToAuthorize(true)
            setConfirmMessageContent('authorize')
            setConfirmButtonText('Authorize')
        }
    }, [buq, buqProgram])

    return (
        <>
            {objectNotEmpty(buq) && remarksParams.length ?
                <>
                    <h2 className='bottom-line'>
                        Facility Demanding Forecasting Form
                    </h2>
                    <DetailsBlock
                        data={detailsData}
                        className='full-width'
                    />
                    <FacilityDemandingForecastingTable
                        getField={getField}
                        tableData={tableData}
                        validateRow={validateRow}
                        remarksParams={remarksParams}
                        buqProgramId={buq.programId}
                        onRowChange={onRowChange}
                        isRowValid={isRowValid}
                        isEditable={!isInApproval}
                    />
                    <Modal
                        isOpen={displaySoFModal}
                        children={
                            <BuqSourceOfFundAddForm
                                onCancel={() => toggleSoFModal({})}
                                loadingModalService={loadingModalService}
                                totalCost={totalCost}
                                fundingDetails={fundingDetails}
                                callSourceOfFundValidation={callSourceOfFundValidation}
                                isEditable={!isInApproval}
                                setIsSourceOfFundInvalid={setIsSourceOfFundInvalid}
                            />
                        }
                        sourceOfFundStyle={true}
                    />
                    <Modal
                        isOpen={displayRejectModal}
                            children={
                            <RejectionCommentsForm
                                onCancel={() => onCancelRejectionComments()}
                                setRejectionDetails={setRejectionDetails}
                                rejectionDetails={rejectionDetails}
                                canReject={!rejectionDetails.rejectionReasons.length}
                                loadingModalService={loadingModalService}
                                onSubmitRejectionComments={onSubmitRejectionComments}
                                isRejected={isRejected}
                                buqId={buq?.id}
                            />
                        }
                        sourceOfFundStyle={true}
                    />
                    <Modal
                        isOpen={displayConfirmationModal}
                        children={
                            <ConfirmModalBody
                                onConfirm={handleSubmitAction}
                                confirmMessage={
                                    `Are you sure you want to ${confirmMessageContent} this forecasting?`
                                }
                                onCancel={() => setDisplayConfirmationModal(false)}
                                confirmButtonText={confirmButtonText}
                            />
                        }
                    />
                    <Modal
                        isOpen={displayRejectConfirmationModal}
                        children={
                            <ConfirmModalBody
                                onConfirm={onSubmitRejectionCommentsForm}
                                confirmMessage='Are you sure you want to reject this forecasting?'
                                onCancel={onCancelRejectionCommentsForm}
                                confirmButtonText="Reject"
                                confirmButtonStyle="danger"
                            />
                        }
                    />
                    <ModalErrorMessage
                        isOpen={displayErrorModal}
                        onClose={() => setDisplayErrorModal(false)}
                        customMessage='The forecasting form has invalid line items.'
                    />
                </> : <></>
            }
            <ActionBar
                totalCost={totalCost.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')}
                currency={BUQ_CURRENCY}
                onSubmitText='Add Source of Fund'
                openSourceOfFund={() => setDisplaySoFModal(true)}
                onCancelAction={isInApproval ? (isInFinalApproval ? backToPreviousPage : backToApprovePage) : backToCreatePage}
                submitAndAuthorizeButton={skipAuthorization}
                onSubmitAndAuthorizeAction={() => setDisplayConfirmationModal(true)}
                submitButton={!skipAuthorization && buqToSubmit}
                saveButton={!isInApproval}
                onSubmitAction={() => setDisplayConfirmationModal(true)}
                authorizeButton={!skipAuthorization && buqToAuthorize}
                onAuthorizeAction={() => setDisplayConfirmationModal(true)}
                typeOfActionText={isInApproval ? 'View' : 'Add'}
                approveButton={isInApproval}
                onApproveAction={() => setDisplayConfirmationModal(true)}
                rejectButton={isInApproval}
                onRejectAction={() => setDisplayRejectModal(true)}
                onSaveAction={handleSaveAction}
                viewRejectionReasonsButton={isRejected}
                onViewReasonsAction={() => toggleRejectModal()}
                isSourceOfFundInvalid={isSourceOfFundInvalid}
            />
        </>
    );
}

export default FacilityDemandingForecasting;
