const express = require('express');
const csvtojson = require('csvtojson');

const agentDAO = require('../DAO/agent');
const { debug } = require('../config/config');

const log = debug('app:http');

const router = express.Router();

router.get('/transactions', async (req, res, next) => {
    const today = new Date(new Date(Date.now()).setHours(0, 0, 0, 0));
    
    console.log('today', today);
    
    const yesterday = new Date(new Date(today.setDate(today.getDate() - 1)).toUTCString())

    console.log('yesterday', yesterday);
    let date = yesterday;

    if (req.query.date) date = new Date(new Date(new Date(req.query.date).setHours(0, 0, 0, 0)).toUTCString());

    log('req.query.date ======= ', req.query.date);
    log('DATE ======= ', date);

    try {
        const agents = await agentDAO.agentsTnx(date);
        log(agents.length)
        return res.status(200).json({
            status: 'success',
            message: 'Agent Transactions retrieved successfully',
            data: agents
        });
    } catch (err) {
        log(err);
        return res.status(500).json({
            status: 'error',
            message: 'Server error'
        })
    }
});

// router.post('/', (req, res, next) => {
//     // let csvData = "test";
//     if (!(req.files && req.files.agent)) {
//         return res.status(400).json({
//             status: 'error',
//             message: 'agent file is required'
//         });
//     }
//     const { agent } = req.files;
//     if (agent.mimetype !== 'text/csv') {
//         return res.status(400).json({
//             status: 'error',
//             message: 'invalid file format, please send a csv file'
//         })
//     }
//     const csvData = req.files.agent.data.toString('utf8');
//     const names = [];
//     csvtojson().fromString(csvData)
//         .then(async agents => {
//             // log(agents);
//             const agentsDTO = [];
//              agents.forEach(agent => {
//                 if (!names.includes(agent['Agent'])) {
//                     names.push(agent['Agent']);
//                     agentsDTO.push({
//                         superAgent: agent['Super Agent (SA)'],
//                         subSuperAgent: agent['Sub Super Agent'],
//                         superAgentMobile: agent['SA Mobile'],
//                         subSuperAgentMobile: agent['Sub Super Agent'],
//                         agent: agent['Agent'],
//                         agentMobile: agent['Agent Mobile'],
//                         terminalId: agent['Terminal ID'],
//                         bank: agent['Bank'],
//                         location: agent['Location'],
//                         value: agent['Value'],
//                         volume: agent['Volume']
//                     })
//                 }
//             });
//             log(agents.length);
//             log(agentsDTO.length);
//             await agentDAO.addAgents(agentsDTO);
//             return res.status(201).json({
//                 status: 'success',
//                 message: 'Transactions uploaded successfully',
//                 data: agents
//             });
//         }).catch(err => {
//             log(err);
//             return res.status(500).json({
//                 status: 'error',
//                 message: 'Server error'
//             })
//         });
// });

module.exports = router;
