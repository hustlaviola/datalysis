const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const fileupload = require("express-fileupload");
const trimmer = require("trim-request-body");

const { debug } = require('./config/config');
const { transactionRouter, agentRouter } = require('./api/index');
const connectDB = require('./config/db');

const log = debug('app:http');

const app = express();

// connectDB();

app.use(express.json());

// Compress response
app.use(compression());

app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(fileupload({
    limits: {
        fileSize: 50 * 1024 * 1024
    },
    abortOnLimit: true,
    responseOnLimit: 'File limit reached',
    // useTempFiles: true
}));
// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Trim request body
app.use(trimmer);

app.use('/transactions', transactionRouter);
app.use('/agents', agentRouter);

app.get('/', (req, res) => res.send(`<h1>Datalysis</h1>`));

// Handle route 404
app.all('/*', (req, res) => {
    return res.status(404).json({
        status: 'error',
        message: 'You are lost, wetin you dey find for here?'
    })
});

const { PORT } = process.env;

app.listen(PORT, async () => {
    await connectDB();
    log(`listening on port: ${PORT}..`)
});
