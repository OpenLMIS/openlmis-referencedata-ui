import React from 'react'

export default function SummaryModalContent({results}) {
  return (
    <div>
        {
            results.map((result, index) => (
                <div key={index}>
                    <h3>File: {result.fileName}</h3>
                    <p>
                        Total entries: {result.totalEntriesCount}
                    </p>
                    <p>
                        Successfull entries: { result.successfulEntriesCount }
                    </p>
                    <p>
                        Failed entries: { result.failedEntriesCount }
                    </p>
                    <div className="errors">
                        {
                            result.errors.map((error, index) => (
                                <div className='error-tile' key={index}>
                                    <h3>Username: { error.username }</h3>
                                    <h4>
                                        Errors
                                    </h4>
                                    <div className="error-messages">
                                        {
                                            error.errors.map((errorMessage, index) => (
                                                <p key={index}>
                                                    { errorMessage }
                                                </p>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            ))
        }
    </div>
  )
}
