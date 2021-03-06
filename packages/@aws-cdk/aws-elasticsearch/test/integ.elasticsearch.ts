import { EbsDeviceVolumeType } from '@aws-cdk/aws-ec2';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as es from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const domainProps: es.DomainProps = {
      version: es.ElasticsearchVersion.V7_1,
      ebs: {
        volumeSize: 10,
        volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
      },
      logging: {
        slowSearchLogEnabled: true,
        appLogEnabled: true,
      },
      nodeToNodeEncryption: true,
      encryptionAtRest: {
        enabled: true,
      },
    };

    // create 2 elasticsearch domains to ensure that Cloudwatch Log Group policy names dont conflict
    new es.Domain(this, 'Domain1', domainProps);
    new es.Domain(this, 'Domain2', domainProps);
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-elasticsearch');
app.synth();
