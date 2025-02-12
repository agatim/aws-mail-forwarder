
import { z } from 'zod';
import { Logger } from './utils/logger';

const inputSchema = z.object({
    Records: z.array(z.object({
        ses: z.object({
            mail: z.string().email(),
            recipients: z.array(z.string().email())
        })
    }))
});

const transformedSchema = inputSchema.transform(e => {
    if (!e.Records || e.Records.length !== 1) {
        console.log('Error: Received invalid SES message.', e);
        throw new Error('Error: Received invalid SES message.');
    }
    return {
        email: e.Records[0].ses.mail,
        recipients: e.Records[0].ses.recipients
    }
})


export const handler = async (event: any, context: any): Promise<void> => {
    Logger.info('Received event.', 'mail-forwarder.handler', { event, context });
    const input = transformedSchema.parse(event);

}
