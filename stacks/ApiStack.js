import { Api, use } from "@serverless-stack/resources"
import { StorageStack } from "./StorageStack"

export function ApiStack({ stack, app }) {
    const { table } = use(StorageStack)

    // Create the API
    const api = new Api(stack, "Api", {
        defaults: {
            authorizer: "iam", // This tells our API that we want to use AWS_IAM across all our routes
            function: {
                permissions: [table], // Allow the API to access the table
                environment: {
                    TABLE_NAME: table.tableName
                }
            }
        },
        // Enabled by default
        cors: true,
        routes: {
            "POST /notes": "functions/create.main",
            "GET /notes/{id}": "functions/get.main",
            "GET /notes": "functions/list.main",
            "PUT /notes/{id}": "functions/update.main",
            "DELETE /notes/{id}": "functions/delete.main",

        }
    })

    // Show the API Endpoint in the output
    stack.addOutputs({
        ApiEndpoint: api.url
    })

    // Return the API resourse
    return {
        api,
    }

}