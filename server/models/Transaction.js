const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const { mongoose } = require('../config/config');

const { Schema } = mongoose;

const TransactionSchema = new Schema({
    email: {
        type: String
    },
    name: {
        type: String
    },
    transactionId: {
        type: String,
        unique: true,
        sparse: true
    },
    transactionType: {
        type: String
    },
    to: {
        type: String
    },
    merchantReference: {
        type: String
    },
    amount: {
        type: Number
    },
    commission: {
        type: String
    },
    description: {
        type: String
    },
    fees: {
        type: Number
    },
    status: {
        type: String
    },
    previousBalance: {
        type: Number
    },
    currentBalance: {
        type: Number
    },
    previousCommissionBalance: {
        type: Number
    },
    currentCommissionBalance: {
        type: Number
    },
    dateTime: {
        type: Date,
    },
    date: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

TransactionSchema.plugin(aggregatePaginate);

const Transaction = mongoose.model('transaction', TransactionSchema);

module.exports = Transaction;
