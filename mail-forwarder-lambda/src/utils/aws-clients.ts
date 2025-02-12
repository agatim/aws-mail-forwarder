import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { Logger } from "./logger";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";


export class AwsClients {
    private dynamoDBDocument: DynamoDBDocument | undefined;
    private s3Client: S3Client | undefined;

    constructor(public region: string) {}

    get dynamoDB(): DynamoDBDocument {
        if (!this.dynamoDBDocument) {
            Logger.debug('Instantiating client.', 'service.dynamoDb');
            this.dynamoDBDocument = DynamoDBDocument.from(
                new DynamoDBClient({
                    region: this.region,
                }),
                {
                    marshallOptions: {removeUndefinedValues: true},
                }
            );
        }
        Logger.debug('Returning client instance.', 'service.dynamoDb');
        return this.dynamoDBDocument;
    }

    get s3(): S3Client {
        if (!this.s3Client) {
            Logger.debug('Instantiating client.', 'service.s3');
            this.s3Client = new S3Client({
                region: this.region,
            });
        }
        Logger.debug('Returning client instance.', 'service.s3');
        return this.s3Client;
    }
}
