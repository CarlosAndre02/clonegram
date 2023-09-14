import fs from 'fs/promises';
import path from 'path';
import { printSchema } from 'graphql/utilities';
import moduleAlias from 'module-alias';
moduleAlias.addAlias('@', path.resolve(__dirname, '..', 'src'));

import { schema } from '../src/schema/schema';

(async () => {
  await fs.writeFile(
    path.resolve(__dirname, '..', '..', '..', 'packages', 'web', 'schema.graphql'),
    printSchema(schema)
  );
})();
