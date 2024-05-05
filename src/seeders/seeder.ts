import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { config } from 'dotenv';

config();

const myDataSource = new DataSource({
  type: 'postgres',
  host: process.env.SQL_DATABASE_HOST,
  port: +(process.env.SQL_DATABASE_PORT || '5432'),
  username: process.env.SQL_DATABASE_USERNAME,
  password: process.env.SQL_DATABASE_PASSWORD,
  database: process.env.SQL_DATABASE_NAME,
  entities: ['src/modules/**/entities/*.entity{.ts,.js}'],
});

(async () => {
  const db = await myDataSource.initialize();
  console.log('--- Db connection established! ---\n');

  const seedersDirectory = path.resolve('src/seeders');
  const files = fs.readdirSync(seedersDirectory);

  for (const file of files) {
    const fullPath = `${seedersDirectory}/${file}`;

    if (fs.existsSync(fullPath) && fullPath.endsWith('.seeder.ts')) {
      const module = await import(fullPath);

      for (const key in module) {
        const seeder = module[key];

        if (typeof seeder === 'function') {
          console.log(
            `✔ Seeding data for "${file.split('.')[0]}" ::: Started!`,
          );
          await seeder(db);
          console.log(
            `✔ Seeding data for "${file.split('.')[0]}" ::: Complete!\n`,
          );
        }
      }
    }
  }

  await db.destroy();
})();
