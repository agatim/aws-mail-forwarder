import { Stack, StackProps } from 'aws-cdk-lib';
import { CnameRecord, HostedZone, IHostedZone } from 'aws-cdk-lib/aws-route53';
import { EmailIdentity, Identity } from 'aws-cdk-lib/aws-ses';
import { Construct } from 'constructs';


export interface MailForwarderStackProps extends StackProps {
    domain: string;
    hostedZoneId: string;
    hostedZoneName: string;
}


export class MailForwarderStack extends Stack {
    private readonly props: MailForwarderStackProps;
    private readonly _hostedZone: IHostedZone;
    private readonly _sesDomain: EmailIdentity;

    constructor(scope: Construct, id: string, props: MailForwarderStackProps) {
        super(scope, id, props);
        this.props = props;
        this._hostedZone = HostedZone.fromHostedZoneId(this, 'HostedZone', this.props.hostedZoneId);
        this._sesDomain = this.createSesIdentity();
    }

    private createSesIdentity(): EmailIdentity {
        const identity = new EmailIdentity(this, 'SesDomain', {
            identity: Identity.domain(this.props.domain)
        });
        for (const dkimDomain of this._sesDomain.dkimRecords) {
            new CnameRecord(this, `DkimRecord${dkimDomain.name}`, {
                zone: this._hostedZone,
                recordName: dkimDomain.name,
                domainName: dkimDomain.value
            });
        }
        return identity;
    }

}
