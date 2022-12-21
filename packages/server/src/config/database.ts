import mongoose from 'mongoose';

import { config } from './env';

export const initDB = async () => {
  mongoose.connection
    .on('error', (error) => console.log(error))
    .once('open', () => console.log('Connected to Database'))
    .on('close', () => console.log('Database connection was closed!'));

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await mongoose.connect(config.mongoUri!);
};
