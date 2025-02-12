import React, { useEffect, useMemo, useState, useRef } from "react";
import TableNoPagination from "../../../react-components/table/table-no-pagination";
import useServerService from "../../../react-hooks/useServerService";
import ModalErrorMessage from "../../../react-components/ModalErrorMessage";
import { toast } from "react-toastify";
import NumericDecimalInput from "../../../react-components/inputs/numeric-decimal-input";
import ResponsiveButton from "../../../react-components/buttons/responsive-button"
import { isEmpty } from "../../../react-components/utils/helpers";
import useLocalStorage from "../../../react-hooks/useLocalStorage";
import {
  BUQ_CURRENCY,
  STORAGE_SOURCE_OF_FUND_FINANCE_NAME,
  STORAGE_SOURCE_OF_FUND_NAME,
} from "../../utils/constants";

const BuqSourceOfFundAddForm = ({
  onCancel,
  loadingModalService,
  totalCost,
  fundingDetails,
  callSourceOfFundValidation,
  isEditable,
  setIsSourceOfFundInvalid,
}) => {
  const [sourcesOfFundParams, setSourcesOfFundParams] = useState([]);
  const [totalProjectedFund, setTotalProjectedFund] = useState(0);
  const [financialGap, setFinancialGap] = useState(0);
  const [displayValidationError, setDisplayValidationError] = useState(false);
  const sourcesOfFundParamsRef = useRef([]);

  const { storedItems, handleClearLocalStorage, handleSaveInLocalStorage } =
    useLocalStorage();

  const adminBuq = useServerService("adminBuq");

  const isSourcesOfFundFormInvalid = (sourcesOfFundParams) => {
    const hasInvalidParams = sourcesOfFundParams.some((sofParam) => {
      return !sofParam.amountUsedInLastFinancialYearIsValid || !sofParam.projectedFundIsValid;
    });

    return hasInvalidParams;
  };

  useEffect(() => {
    if (storedItems.sourcesOfFunds) {
      setSourcesOfFundParams(storedItems.sourcesOfFunds);
    } else {
      loadingModalService.open();
      adminBuq
        .getSourcesOfFunds()
        .then((sourcesOfFund) => {
          const { content } = sourcesOfFund;

          if (fundingDetails.sourcesOfFunds.length > 0) {
            const indicatedSourceOfFund = fundingDetails.sourcesOfFunds.map(
              (sourceOfFund) => {
                return {
                  id: sourceOfFund.sourceOfFund.id,
                  indicatedSourceOfFund: sourceOfFund.sourceOfFund.name,
                  amountUsedInLastFinancialYear:
                    sourceOfFund.amountUsedInLastFinancialYear,
                  amountUsedInLastFinancialYearIsValid: true,
                  projectedFund: sourceOfFund.projectedFund,
                  projectedFundIsValid: true,
                };
              }
            );
            setSourcesOfFundParams(indicatedSourceOfFund);
            handleSaveInLocalStorage(
              STORAGE_SOURCE_OF_FUND_NAME,
              indicatedSourceOfFund
            );
          } else {
            const indicatedSourceOfFund = content.map(({ id, name }) => ({
              id: id,
              indicatedSourceOfFund: name,
              amountUsedInLastFinancialYear: "",
              amountUsedInLastFinancialYearIsValid: true,
              projectedFund: "",
              projectedFundIsValid: true,
            }));
            setSourcesOfFundParams(indicatedSourceOfFund);
          }
        })
        .finally(() => {
          loadingModalService.close();
        });
    }
  }, []);

  useEffect(() => {
    sourcesOfFundParamsRef.current = sourcesOfFundParams;
    if (sourcesOfFundParams.length > 0) {
      const totalProjectedFund = sourcesOfFundParams?.reduce(
        (sum, item) => sum + (item.projectedFund ?? 0),
        0
      );

      const formattedTotalProjectedFund = Number(totalProjectedFund)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");

      setTotalProjectedFund(formattedTotalProjectedFund);

      const financialGap = (
        Number(formattedTotalProjectedFund.replace(/ /g, "")) - totalCost
      )
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");

      setFinancialGap(financialGap);

      handleSaveInLocalStorage(STORAGE_SOURCE_OF_FUND_FINANCE_NAME, {
        totalProjectedFund: Number(totalProjectedFund).toFixed(2),
        gap: (
          Number(formattedTotalProjectedFund.replace(/ /g, "")) - totalCost
        ).toFixed(2),
      });
    }
  }, [sourcesOfFundParams]);

  useEffect(() => {
    if (sourcesOfFundParams.length && callSourceOfFundValidation) {
      handleValidateSourceOfFundsTable();
    }
  }, [sourcesOfFundParams.length]);

  const updateData = (index, field, value) => {
    const updatedSourcesOfFundParams = [...sourcesOfFundParamsRef.current];

    if (field === "amountUsedInLastFinancialYear") {
      updatedSourcesOfFundParams[index].amountUsedInLastFinancialYear = value;
      updatedSourcesOfFundParams[index].amountUsedInLastFinancialYearIsValid =
        !isEmpty(value);
      if (isEmpty(updatedSourcesOfFundParams[index].projectedFund)) {
        updatedSourcesOfFundParams[index].projectedFundIsValid = false;
      }
    }

    if (field === "projectedFund") {
      updatedSourcesOfFundParams[index].projectedFund = value;
      updatedSourcesOfFundParams[index].projectedFundIsValid = !isEmpty(value);
      if (
        isEmpty(updatedSourcesOfFundParams[index].amountUsedInLastFinancialYear)
      ) {
        updatedSourcesOfFundParams[
          index
        ].amountUsedInLastFinancialYearIsValid = false;
      }
    }
    setSourcesOfFundParams(updatedSourcesOfFundParams);
  };

  const handleValidateSourceOfFundsTable = () => {
    let isValid = true;
    const updatedSourcesOfFundParams = [...sourcesOfFundParams];

    updatedSourcesOfFundParams.map((order) => {
      if (isEmpty(order.amountUsedInLastFinancialYear)) {
        order.amountUsedInLastFinancialYearIsValid = false;
        isValid = false;
      }

      if (isEmpty(order.projectedFund)) {
        order.projectedFundIsValid = false;
        isValid = false;
      }
    });

    if (!isValid) {
      setSourcesOfFundParams(updatedSourcesOfFundParams);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (handleValidateSourceOfFundsTable()) {
      handleClearLocalStorage(STORAGE_SOURCE_OF_FUND_NAME);
      handleSaveInLocalStorage(
        STORAGE_SOURCE_OF_FUND_NAME,
        sourcesOfFundParams
      );
      toast.success("Source of Fund saved successfully");
      setIsSourceOfFundInvalid(false);
      onCancel();
      return;
    }
    setIsSourceOfFundInvalid(true);
    setDisplayValidationError(true);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Indicated Source Of Fund",
        accessor: "indicatedSourceOfFund",
      },
      {
        Header: `Amount Used in Last Financial Year in ${BUQ_CURRENCY}`,
        accessor: "amountUsedInLastFinancialYear",
        Cell: ({ row }) => (
          <NumericDecimalInput
            value={row.original.amountUsedInLastFinancialYear ?? ""}
            isInvalid={!row.original.amountUsedInLastFinancialYearIsValid}
            key={`row-${row.original}${row.id}`}
            onChange={(value) =>
              updateData(row.index, "amountUsedInLastFinancialYear", value)
            }
            disabled={!isEditable}
          />
        ),
      },
      {
        Header: `Projected Fund in ${BUQ_CURRENCY}`,
        accessor: "projectedFund",
        Cell: ({ row }) => (
          <NumericDecimalInput
            value={row.original.projectedFund ?? ""}
            isInvalid={!row.original.projectedFundIsValid}
            onChange={(value) => updateData(row.index, "projectedFund", value)}
            key={`row-${row.original}${row.id}`}
            disabled={!isEditable}
          />
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="page-container">
        <div className="page-header-responsive header-sof-modal">
          <h2>Funding Source For Health Commodities Procurement </h2>
        </div>
        <div className="table-container">
          <TableNoPagination
            customReactTableContainerStyle="source-of-fund-table-container"
            customReactTableContentStyle="custom-react-table-content"
            customReactTableStyle="custom-react-table"
            columns={columns}
            data={sourcesOfFundParams}
          />
        </div>
        <div className="table-sum-up">
          <p>{`Total Projected Fund: ${totalProjectedFund} ${BUQ_CURRENCY}`}</p>
          <p>{`Total Forecasted Cost: ${totalCost
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")} ${BUQ_CURRENCY}`}</p>
          <p>{`Gap: ${financialGap} ${BUQ_CURRENCY}`}</p>
        </div>
        <div className="bottom-bar">
          <div>
            <button type="button" className="secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
          <div>
            {isEditable &&
              <ResponsiveButton
                onClick={() => handleSave()}
                className="btn btn-primary"
              >
                Save
              </ResponsiveButton>
            }
          </div>
        </div>
      </div>
      <ModalErrorMessage
        isOpen={displayValidationError}
        onClose={() => setDisplayValidationError(false)}
      />
    </>
  );
};

export default BuqSourceOfFundAddForm;
