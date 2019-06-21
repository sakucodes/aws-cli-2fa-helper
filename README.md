# aws-cli-2fa-helper
A little helper to update your AWS 2FA session token in the credentials file.

https://docs.aws.amazon.com/cli/latest/reference/sts/get-session-token.html

**Preperation**
- node is installed
- MFA is activated. Yubikey is not working via console script.
- You know your ARN. https://docs.aws.amazon.com/de_de/IAM/latest/UserGuide/id_credentials_mfa_enable_cliapi.html
  - aws iam list-mfa-devices --user-name \<username\>
  - You get something like arn:aws:iam::123456789012:mfa/user

**Usage**

- install global: npm install -g https://github.com/sakucodes/aws-cli-2fa-helper
- configure: aws-mfa-gen config -s <your-aws-credentials-section-name> -d <your-device-serial-number>
- use it: aws-mfa-gen 123456

----

## General

**Create Session Token**
If you have everything you need, you can generate your session token.
The cli command:

`aws sts get-session-token --serial-number arn-of-the-mfa-device --token-code code-from-token`

_Example_

`aws sts get-session-token --serial-number arn:aws:iam::123456789012:mfa/user --token-code 000000`

The result you get looks like this (shortened):

```
{
    "Credentials": {
        "SecretAccessKey": "J3uMQubsZ7FI8GrEE...",
        "SessionToken": "FQoGZXIvYXdzEGcaDLoHi3ewVVprnyPGdCKw...",
        "Expiration": "2019-02-13T01:07:59Z",
        "AccessKeyId": "ASIATD27OMN4..."
    }
}
```

In the credentials file add the following section.
```
[mfa]
aws_access_key_id = ASIATD27OMN4...
aws_secret_access_key = J3uMQubsZ7FI8GrEE...
aws_session_token = FQoGZXIvYXdzEGcaDLoHi3ewVVprnyPGdCKw...
```


