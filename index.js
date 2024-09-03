import mongoose from 'mongoose';
//const mongoose = require('mongoose');
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import CONFIG from './config.json' assert {type : 'json'}
import api from './api/index.js';

dotenv.config()
const PORT = CONFIG.port || 7000
const app = express();
app.use(cors());

mongoose.connect(CONFIG.mongo_url)
    .then((db) => {
        app.use(express.json());
        app.use('/api', api({ config: CONFIG, db }))
        console.log('connected to MongoDB');
        app.listen(
            PORT,
            () => console.log(`SERVER IS RUNNIN IN ${PORT}`)
        )

    }).catch((err) => { console.log(err, "Received an Error") })