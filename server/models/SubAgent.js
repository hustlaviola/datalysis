const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const { mongoose } = require('../config/config');

const { Schema } = mongoose;

const SubAgentSchema = new Schema({
    agent: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

SubAgentSchema.plugin(aggregatePaginate);

const Agent = mongoose.model('subagent', SubAgentSchema);

module.exports = Agent;
