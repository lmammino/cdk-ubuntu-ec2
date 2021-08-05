import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'

export class CdkUbuntuEc2Stack extends cdk.Stack {
  constructor (scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      env: {
        account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
      },
      ...props
    })

    const defaultVpc = ec2.Vpc.fromLookup(this, 'VPC', {
      isDefault: true
    })

    const userData = ec2.UserData.forLinux()
    userData.addCommands(
      'apt-get update -y',
      'apt-get install -y git awscli ec2-instance-connect',
      'until git clone https://github.com/aws-quickstart/quickstart-linux-utilities.git; do echo "Retrying"; done',
      'cd /quickstart-linux-utilities',
      'source quickstart-cfn-tools.source',
      'qs_update-os || qs_err',
      'qs_bootstrap_pip || qs_err',
      'qs_aws-cfn-bootstrap || qs_err',
      'mkdir -p /opt/aws/bin',
      'ln -s /usr/local/bin/cfn-* /opt/aws/bin/'
    )
    const machineImage = ec2.MachineImage.fromSSMParameter(
      '/aws/service/canonical/ubuntu/server/focal/stable/current/amd64/hvm/ebs-gp2/ami-id',
      ec2.OperatingSystemType.LINUX,
      userData
    )

    const myVmSecurityGroup = new ec2.SecurityGroup(this, 'myVmSecurityGroup', {
      vpc: defaultVpc
    })
    myVmSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'httpIpv4')
    myVmSecurityGroup.addIngressRule(ec2.Peer.anyIpv6(), ec2.Port.tcp(80), 'httpIpv6')

    const myVm = new ec2.Instance(this, 'myVm', {
      // the type of instance to deploy (e.g. a 't2.micro')
      instanceType: new ec2.InstanceType('t2.micro'),
      // the id of the image to use for the instance
      machineImage: machineImage,
      // A reference to the object representing the VPC
      // you want to deploy the instance into
      vpc: defaultVpc,
      // security group
      securityGroup: myVmSecurityGroup,
      // init script
      init: ec2.CloudFormationInit.fromElements(
        ec2.InitCommand.shellCommand('sudo apt-get install -y nginx')
      )
      // ... more configuration can go here
    })

    // this will print the URL to our web server as output
    const webVmUrl = new cdk.CfnOutput(this, 'webVmUrl', {
      value: `http://${myVm.instancePublicIp}/`,
      description: 'The URL of our instance',
      exportName: 'webVmUrl'
    })
  }
}
