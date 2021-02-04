const Agent = require('../models/Agent');
const Transaction = require('../models/Transaction');

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
    let ll = 0;
    const agents = await Agent.find().sort({agent: 1});
    console.log('AGENTS LENGTH', agents.length)

    console.log('DATE ======= ', date);

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
    console.log('TRANSACTIONS LENGTH', transactions.length)
    agents.forEach(agent => {
        let ag = {
            agent: agent.agent,
            amount: 0
        };
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].name == agent.agent) {
                ag = {
                    agent: agent.agent,
                    email: transactions[i].email,
                    amount: transactions[i].totalAmount
                };
                ll += 1;
                break;
            }
        }
        data.push(ag);
    });
    console.log('LL', ll);
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
    agentsTnx
};
