import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';


export interface MailForwarderStackProps {
}


export class MailForwarderStack extends Stack {
    constructor(scope: Construct, id: string, props: MailForwarderStackProps) {
        super(scope, id, props);
    }
}
