const dotenv = require('dotenv');

const { debug, mongoose } = require('./config');

dotenv.config();

const log = debug('app:mongo');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            bufferCommands: false,
            useFindAndModify: false
        });
        log('MongoDB connected..');
    } catch (error) {
        log(error);
    }
};

module.exports = connectDB;
