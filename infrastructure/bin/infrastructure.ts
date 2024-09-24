#!/usr/bin/env node
import * as path from "path";
import * as fs from "fs";
import * as readline from 'readline-sync';
import {App} from "aws-cdk-lib";
import {environment} from "../environments/environment";
import { HostedZone } from "aws-cdk-lib/aws-route53";

// CDK App
const app = new App();

if (!process.env.ENVIRONMENT_NAME) {
    const dotEnvPath = path.resolve(__dirname, '../../../.env');
    /* eslint-disable @typescript-eslint/no-var-requires */
    if (fs.existsSync(dotEnvPath)) {
        // Load deploy configuration from .env
        require('dotenv').config({
            path: dotEnvPath,
        });
    }
}

// If env prefix not provided in env variable or .env file, ask for it
if (!process.env.ENVIRONMENT_NAME) {
    process.env.ENVIRONMENT_NAME = readline.question(`process.env.ENVIRONMENT_NAME not defined and ENVIRONMENT_NAME not defined in [root]/.env. Please, enter its value here:`);
}

// If env prefix is still not provided, fail
if (!process.env.ENVIRONMENT_NAME) {
    throw new Error(`
        Can not deploy infrastructure with missing ENVIRONMENT_NAME.
        It is used to prefix all CloudFormation stack names.
        Try setting it in [root]/.env or providing it as an environment variable before "cdk deploy".
        For example: "ENVIRONMENT_NAME=develop cdk deploy"
    `);
}

try {
    const hostedZone = HostedZone.fromHostedZoneAttributes(
        this,
        `PublicHostedZone`,
        {
            zoneName: environment.zone.name,
            hostedZoneId: environment.zone.id,
        }
    );
    new MailForwarderStack(app, 'MailForwarderStack', {
        stackName: `${environment.name}-mail-forwarder-stack`,
        tags: {
            BILLING_ENTITY: environment.billingTag
        }
    });
} catch (error) {
    // Capture stack synthesizing errors and stack dependency errors
    console.log(error);
    throw Error("Can not deploy app stacks due to an internal error. See Stack Trace above");
}
