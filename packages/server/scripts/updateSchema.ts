import fs from 'fs/promises';
import path from 'path';
import { printSchema } from 'graphql/utilities';

import { schema } from '../src/schema/schema';

(async () => {
  await fs.writeFile(
    path.resolve(__dirname, '..', '..', '..', 'schema.graphql'),
    printSchema(schema)
  );
})();
