const Transaction = require('../models/Transaction');

const addTransaction = async transactions => {
    while (transactions.length > 200) {
        await Transaction.insertMany(transactions.splice(0, 200))
    }
    if (transactions.length !== 0) {
        return Transaction.insertMany(transactions);
    }
}

const getAgentTransactions = (date = Date.now()) => {
    const today = new Date(new Date(date).setHours(0, 0, 0, 0));
    
    console.log('today', today);
    
    const yesterday = new Date(today.setDate(today.getDate() - 1))
    
    // console.log('yesterday', yesterday);
    
    return Transaction.aggregate([
        {
            $group: {
                _id: { email: '$email', name: '$name' },
                // data: {
                //     $push: '$$ROOT'
                // },
                totalAmount: { $sum: '$amount' }
            }
        },
        { $sort: { '_id.email': 1 } },
        {
            $project: {
                _id: 0,
                email: '$_id.email',
                name: '$_id.name',
                totalAmount: 1
            }
        }
    ]);
}

module.exports = {
    addTransaction,
    getAgentTransactions
};
