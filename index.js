const argv = require('yargs').argv,
    fs = require('fs'),
    ini = require('ini')

const {
    exec
} = require('child_process')

const homedir = require('os').homedir();
const awsCredFile = `${homedir}/.aws/credentials`;

const settings = ini.parse(fs.readFileSync('./config.ini', 'utf-8')).settings;

const mfaSection = settings.credentialsSection;
const serialNumber = settings.serialNumber || argv.serialNumber || argv.s || argv._[0];
const tokenCode = argv.code || argv.c || argv._[1] || argv._[0];
const awsCliCommand = `aws sts get-session-token --serial-number arn:aws:iam::${serialNumber} --token-code ${tokenCode}`;

console.log(awsCliCommand);
const awsCli = exec(awsCliCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }

    if (stdout) {
        const credentials = JSON.parse(stdout).Credentials;
        const credFile = ini.parse(fs.readFileSync(awsCredFile, 'utf-8'));

        credFile[mfaSection].aws_access_key_id = credentials.AccessKeyId;
        credFile[mfaSection].aws_secret_access_key = credentials.SecretAccessKey;
        credFile[mfaSection].aws_session_token = credentials.SessionToken;

        fs.writeFileSync(awsCredFile, ini.stringify(credFile, { whitespace : true }));
        console.log(`Token valid until: ${credentials.Expiration}`);
        return;
    }

    if (stderr) {
        console.log(`stderr: ${stderr}`);
    }
});
