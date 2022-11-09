import './config/module-alias';
import app from './server';
import { config } from './config/env';
import { initDB } from './config/database';

(async () => {
  try {
    await initDB();
  } catch (error) {
    console.error('Unable to connect to database', error);
    process.exit(1);
  }

  app.listen(config.PORT, async () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
})();
