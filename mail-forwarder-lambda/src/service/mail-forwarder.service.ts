import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { AwsClients } from "../utils/aws-clients";
import { environment } from "../environments/environment";
import { Logger } from "../utils/logger";
import { GetObjectCommand } from "@aws-sdk/client-s3";



export class MailForwarderService {

    constructor(private readonly awsClients: AwsClients) {}

    async forwardMail(from: string, messageId: string): Promise<void> {
        const forwardingRules = await this.getForwardingRules(from);
        const emailBody = await this.getMailFromS3(messageId);

    }

    private async getForwardingRules(from: string): Promise<string[]> {
        Logger.debug(`Getting forwarding rules for ${from} .`, 'mail-forwarder.service.getForwardingRules');
        const resp = await this.awsClients.dynamoDB.send(new GetCommand({
            TableName: environment.TABLE_NAME,
            Key: {
                pk: 'RULE',
                sk: `FROM#${from.toLowerCase()}`
            }
        }));
        Logger.debug(`Got response.`, 'mail-forwarder.service.getForwardingRules', resp);
        if (!resp.Item) {
            return [];
        }
        return resp.Item.forwardingAddresses ?? [];
    }

    private async getMailFromS3(messageId: string): Promise<string> {
        const resp = await this.awsClients.s3.send(new GetObjectCommand({
            Bucket: environment.BUCKET_NAME,
            Key: messageId
        }));
        if (!resp.Body) {
            throw new Error('Error getting body.');
        }
        return resp.Body.transformToString();
    }
}
