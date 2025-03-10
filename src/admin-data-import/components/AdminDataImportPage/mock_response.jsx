export const MOCK_RESPONSE = {
    results: [
        {
            fileName: "users.csv",
            totalEntriesCount: 10,
            successfulEntriesCount: 8,
            failedEntriesCount: 2,
            errors: [
                {
                    errors: ["Email is invalid", "Email is duplicated"],
                    username: "john1"
                },
                {
                    errors: ["email is duplicated"],
                    username: "john2"
                }
            ]
        }
    ]
};
