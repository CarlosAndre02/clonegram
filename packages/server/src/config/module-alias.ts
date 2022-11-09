import path from 'path';
import moduleAlias from 'module-alias';

moduleAlias.addAlias('@', path.resolve(__dirname, '..'));
