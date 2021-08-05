# cdk-ubuntu-ec2

This repository shows an example of using [AWS CDK](https://aws.amazon.com/cdk/) to provision an Ubuntu-based EC2 instance with a running nginx server.

This will include installing the [AWS Linux utilities](https://github.com/aws-quickstart/quickstart-linux-utilities) in the machine.

You can read more about this example in the article [Provision an Ubuntu-based EC2 instance with CDK](https://loige.co/provision-ubuntu-ec2-with-cdk).


## Code structure

This is a standard CDK project.

The main stack definition can be found in [`lib/cdk-ubuntu-ec2-stack.ts`](/lib/cdk-ubuntu-ec2-stack.ts).

The stack is instantiated in [`bin/cdk-ubuntu-ec2.ts`](/bin/cdk-ubuntu-ec2.ts).


## Requirements and deployment

In order to be able to deploy this CDK project you need to have the following:

  - An AWS account
  - The [AWS CLI](https://aws.amazon.com/cli/) installed and configured in your development machine
  - [AWS CDK](https://aws.amazon.com/cdk/) installed and configured in your development machine

In order to deploy this CDK project to your AWS account you simply have to clone this repository and from the root folder of the project run:

```bash
cdk deploy
```

Then prompt `y` for yes.

If you want to clean up your account you can delete this stack with:

```bash
cdk destroy
```


## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/cdk-ubuntu-ec2/issues).


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
