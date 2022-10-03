import app from './server';
import { config } from './config/env';

app.listen(config.PORT, async () => {
  console.log(`Server is running on port ${config.PORT}`);
});
