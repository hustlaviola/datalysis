const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const { mongoose } = require('../config/config');

const { Schema } = mongoose;

const AgentSchema = new Schema({
    superAgent: {
        type: String
    },
    subSuperAgent: {
        type: String
    },
    superAgentMobile: {
        type: String
    },
    subSuperAgentMobile: {
        type: String
    },
    agent: {
        type: String
    },
    agentMobile: {
        type: String
    },
    terminalId: {
        type: String
    },
    bank: {
        type: String
    },
    location: {
        type: String
    },
    value: {
        type: Number
    },
    volume: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

AgentSchema.plugin(aggregatePaginate);

const Agent = mongoose.model('agent', AgentSchema);

module.exports = Agent;
