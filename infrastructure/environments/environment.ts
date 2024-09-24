export interface Environment {
    name: string;
    billingTag: string;
}


export const environment: Environment = {
    name: 'prod',
    billingTag: 'MAIL_FORWARDER'
};
