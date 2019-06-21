#!/usr/bin/env node

const argv = require('yargs')
    .usage('Usage: aws-mfa-gen <command> [options]')
    .help('h')
    .command('$0', 'Generate new session credentials and store them in your aws credentials file.',
        (yargs) => {
            yargs.option('c', {
                type: 'number',
                alias: 'code',
                describe: 'The token code'
            })
        }, (argv) => {
            const tokenCode = argv.code || argv.c || argv._[0];

            const awsTool = require('../src/index');
            if (tokenCode) {
                awsTool.generate(tokenCode);
            }
        }
    )
    .command('config', 'Configure tool with your device serial number and the section name in your credentials file',
        (yargs) => {
            yargs.option('s', {
                    array: false,
                    type: 'string',
                    alias: 'credentialsSection',
                    describe: 'The name of the section for MFA in the AWS credentials file.'
                })
                .option('d', {
                    array: false,
                    type: 'string',
                    alias: 'device',
                    describe: 'The serial number of your registered MFA device.'
                })
        },
        (argv) => {
            const configure = require('../src/configure');

            if (argv.credentialsSection || argv.device) {
                configure.configure(argv.device, argv.credentialsSection);
            }
        }
    )
    .argv;
