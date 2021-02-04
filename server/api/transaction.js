const express = require('express');
const csvtojson = require('csvtojson');

const FileService = require('../services/fileService');
const transactionDAO = require('../DAO/transaction');
const { debug } = require('../config/config');
const MD5 = require('../models/MD5');

const log = debug('app:http');

const router = express.Router();

// router.get('/', async (req, res, next) => {
//     try {
//         const agents = await transactionDAO.getAgentTransactions()
//         log(agents.length)
//         return res.status(200).json({
//             status: 'success',
//             message: 'Agent Transactions retrieved successfully',
//             data: agents
//         });
//     } catch (err) {
//         log(err);
//         return res.status(500).json({
//             status: 'error',
//             message: 'Server error'
//         })
//     }
// });

router.post('/', async (req, res, next) => {
    // let csvData = "test";
    if (!(req.files && req.files.transaction)) {
        return res.status(400).json({
            status: 'error',
            message: 'transaction file is required'
        });
    }
    const { transaction } = req.files;
    if (transaction.mimetype !== 'text/csv') {
        return res.status(400).json({
            status: 'error',
            message: 'invalid file format, please send a csv file'
        })
    }
    log('MD5 === ', transaction.md5)

    const md5Exists = await MD5.findOne({ md5: transaction.md5 });
    if (md5Exists) {
        return res.status(409).json({
            status: 'error',
            message: 'File already uploaded'
        })
    }

    const csvData = transaction.data.toString('utf8');
    csvtojson().fromString(csvData)
        .then(async transactions => {
            const transactionsDTO = transactions.map(transaction => ({
                name: transaction['From'],
                email: transaction['Email'],
                transactionId: transaction['Transaction ID'],
                transactionType: transaction['Transaction Type'],
                to: transaction['To'],
                merchantReference: transaction['Merchant Reference'],
                amount: transaction['Amount'],
                commission: transaction['Commission'],
                description: transaction['Description'],
                fees: transaction['Fees'],
                status: transaction['Status'],
                previousBalance: transaction['Previous Balance'],
                currentBalance: transaction['Current Balance'],
                previousCommissionBalance: transaction['Previous Commission Balance'],
                currentCommissionBalance: transaction['Current Commission Balance'],
                dateTime: transaction['Date'],
                date: new Date(new Date(transaction['Date']).setHours(0, 0, 0, 0)).toUTCString()
            }));
            // log(transactionsDTO);
            await transactionDAO.addTransaction(transactionsDTO);
            try {
                await MD5.create({ md5: transaction.md5, fileName: transaction.name });
            } catch (error) {
                log('MD5 ERROR', error)
            }
            return res.status(201).json({
                status: 'success',
                message: 'Transactions uploaded successfully'
            });
        }).catch(err => {
            log(err);
            return res.status(500).json({
                status: 'error',
                message: 'Server error'
            })
        });
});

module.exports = router;
