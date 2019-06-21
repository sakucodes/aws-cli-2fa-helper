const fs = require('fs');

const configFilePath = `${require('os').homedir()}/.aws/mfa-gen-config.json`;

const configObj = {credentialsSection: '', serialNumber: ''};

const ensureConfigFile = () => {
    if (!fs.existsSync(configFilePath)) {
        fs.writeFileSync(configFilePath, JSON.stringify(configObj));
    }
};

const updateConfig = (device, credentialsSectionName) => {

    ensureConfigFile();
    const configs = require(configFilePath);

    if (credentialsSectionName) {
        configs.credentialsSection = credentialsSectionName;
    }

    if (device) {
        configs.serialNumber = device;
    }

    console.log(configs);

    fs.writeFileSync(configFilePath, JSON.stringify(configs));
};

exports.configure = updateConfig;