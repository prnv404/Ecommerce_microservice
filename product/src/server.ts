import express from 'express';
import { MONGO_URI, PORT } from './config';
import { ConnectDb } from './database';
import { ExpressApp } from './app';

const StartServer = async() => {

    const app = express();
    
    await ConnectDb(MONGO_URI);
    
    await ExpressApp(app);

    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })

}

StartServer();
