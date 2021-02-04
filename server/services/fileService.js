const fs = require('fs')
const util = require('util')
const path = require('path')

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const tnxFilePath = path.join(__dirname, '../transactions.json');
const agentFilePath = path.join(__dirname, '../agents.json');

const saveAgentFile = json => writeFile(agentFilePath, json);

const saveTransactionFile = json => writeFile(tnxFilePath, json);

const getData = () => readFile(filePath);

const getRecord = async name => {
    const data = JSON.parse(await getData());
    const question = data.find(datum => datum.name === id);
    return question;
};

module.exports = {
    saveAgentFile,
    saveTransactionFile
};
