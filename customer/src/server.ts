import express from 'express';
import { MONGO_URI, PORT } from './config';
import { ConnectDb } from './database';
import { CreateChannel } from './utils';
import { ExpressApp } from './app';

const StartServer = async() => {

    const app = express();
    
    await ConnectDb(MONGO_URI);

    const channel = await CreateChannel()

    await ExpressApp(app);

    app.listen(PORT, () => {
          console.log(`listening to port ${PORT}`);
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })
    .on('close', () => {
        channel.close();
    })
    

}

StartServer();
