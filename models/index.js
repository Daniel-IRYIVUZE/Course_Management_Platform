import { readdirSync } from 'fs';
import { basename as _basename, join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';  // Added pathToFileURL
import Sequelize from 'sequelize';
import sequelize from '../connection/connection.js';
import { setupAssociations } from './associations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = _basename(__filename);

const db = {};

async function loadModels() {
  const files = readdirSync(__dirname).filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file !== 'associations.js' && // important to exclude
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  });

  for (const file of files) {
    // Convert the absolute path to file:// URL for import()
    const modulePath = pathToFileURL(join(__dirname, file)).href;

    const modelModule = await import(modulePath);
    const model = modelModule.default;

    if (!model) {
      console.error(`Model not found in file: ${file}`);
      continue;
    }

    if (!model.name) {
      console.error(`Model in file ${file} has no name`);
      continue;
    }

    db[model.name] = model;
  }

  // Setup associations
  setupAssociations(sequelize);

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  // Optional sync (uncomment if needed)
  await sequelize.sync({ alert: true });

  console.log('Database synchronized (models synced).');
}

// Run the loader
await loadModels();

export default db;
