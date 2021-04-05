import { config } from 'dotenv';
import app from './app';

config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
    console.log('Server running on port: ' + port);
});