const Agent = require('../models/Agent');
const SubAgent = require('../models/SubAgent');
const Transaction = require('../models/Transaction');

// const subAgents = [];

// const addSubAgents = async () => {
//     while (subAgents.length > 200) {
//         await SubAgent.insertMany(subAgents.splice(0, 200))
//     }
//     if (subAgents.length !== 0) {
//         return SubAgent.insertMany(subAgents);
//     }
// };

const addAgents = async agents => {
    while (agents.length > 200) {
        await Agent.insertMany(agents.splice(0, 200))
    }
    if (agents.length !== 0) {
        return Agent.insertMany(agents);
    }
};

const agentsTnx = async date => {
    const data = [];
    const agents = await SubAgent.find().sort({agent: 1});

    const transactions = await Transaction.aggregate([
        {
            $match: {
                date
            }
        },
        {
            $group: {
                _id: { name: '$name' },
                totalAmount: { $sum: '$amount' }
            }
        },
        { $sort: { '_id.name': 1 } },
        {
            $project: {
                _id: 0,
                name: '$_id.name',
                email: '$_id.email',
                totalAmount: 1
            }
        }
    ]);
    agents.forEach(agent => {
        let ag = {
            agent: agent.agent,
            amount: 0
        };
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].name.toLowerCase() == agent.agent.toLowerCase()) {
                ag = {
                    agent: agent.agent,
                    email: transactions[i].email,
                    amount: transactions[i].totalAmount
                };
                break;
            }
        }
        data.push(ag);
    });
    return data;
}

// const agentsTnxss = async () => {
//     const agents = await Agent.find();
//     console.log(agents.length)
//     const data = [];
//     for (let i = 0; i < agents.length; i++) {
//         const agent = await Transaction.aggregate([
//             {
//                 $match: {
//                     name: agents[i].agent
//                 }
//             },
//             {
//                 $group: {
//                     _id: { name: '$name' },
//                     // data: {
//                     //     $push: '$$ROOT'
//                     // },
//                     totalAmount: { $sum: '$amount' }
//                 }
//             },
//             { $sort: { '_id.email': 1 } },
//             {
//                 $project: {
//                     _id: 0,
//                     email: '$_id.email',
//                     name: '$_id.name',
//                     totalAmount: 1
//                 }
//             }
//         ]);
//         if (agent[0]) {
//             data.push({
//                 agent: agents[i].agent,
//                 name: agent[0].name,
//                 amount: agent[0].totalAmount
//             })
//         } else {
//             data.push({
//                 agent: agents[i].agent,
//                 amount: 0
//             })
//         }
//         // console.log(agent);
//     }
//     console.log('DATA LENGTH', data.length)
//     return data
// }

// const agentsTn = () => {
//     return Agent.aggregate([
//         {
//             $sort: {
//                 agent: 1
//             }
//         },
//         {
//             $lookup: {
//                 from: Transaction.collection.name,
//                 localField: 'name',
//                 foreignField: 'agent',
//                 as: 'transaction'
//             }
//         },
//         {
//             $unwind: '$transaction'
//         },
//         {
//             $group: {
//                 _id: { name: '$transaction.name' },
//                 // data: {
//                 //     $push: '$$ROOT'
//                 // },
//                 totalAmount: { $sum: '$transaction.amount' }
//             }
//         },
//         // { $sort: { '_id.email': 1 } },
//         {
//             $project: {
//                 // _id: 0,
//                 agent: 1,
//                 // email: '$_id.email',
//                 name: '$transaction.name',
//                 email: '$transaction.email',
//                 amount: '$transaction.amount',
//                 gname: '$_id.name',
//                 totalAmount: 1
//             }
//         }
//     ]);
// }

module.exports = {
    addAgents,
    agentsTnx,
    // addSubAgents
};
