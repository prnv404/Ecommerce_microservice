import express from 'express';
import { MONGO_URI, PORT } from './config';
import { ConnectDb } from './database';
import { ShoppingApp } from './app';

const StartServer = async() => {

    const app = express();
    
    await ConnectDb(MONGO_URI);
    
    await ShoppingApp(app);

    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })

}

StartServer();
