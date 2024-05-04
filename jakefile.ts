import { config } from 'dotenv';
import { task, desc } from 'jake';
import { DataSource } from 'typeorm';
import { google } from 'googleapis';
import { Designation } from './src/modules/designations/designations.interface';

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

desc('sync designations');
task('sync_designation', async () => {
  try {
    const db = await myDataSource.initialize();

    await db.transaction(async (transactionalEntityManager) => {
      const designationsRepository =
        transactionalEntityManager.getRepository('designations');
      const newDesignations: Designation[] = [];

      const sheetName = 'Designations';
      const range = `${sheetName}!A:d`;

      const sheets = google.sheets({
        version: 'v4',
        auth: process.env.GOOGLE_API_KEY,
      });

      // Retrieve information about the spreadsheet
      const response = await sheets.spreadsheets.get({
        spreadsheetId: process.env.EMPLOYEES_MASTER_DATA_SEEDING_SPREADSHEET_ID,
      });

      if (!response.data.sheets) {
        throw new Error('Sheets data not found in response.');
      }

      const sheet = response.data.sheets.find(
        (sheet) => sheet?.properties?.title === sheetName,
      );

      if (!sheet) {
        throw new Error(`Sheet '${sheetName}' not found.`);
      }

      const dataResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.EMPLOYEES_MASTER_DATA_SEEDING_SPREADSHEET_ID,
        range: range,
      });

      const values = dataResponse.data.values;

      if (!values || !Array.isArray(values)) {
        throw new Error('Values data not found or not an array.');
      }

      const [header, ...dataRows] = values;

      if (header.join(',') !== 'Title,Level,Technology,Specialization') {
        throw new Error('Invalid headers!');
      }

      //Retrieve all designations present
      const designations = await designationsRepository.find({
        select: ['title', 'level', 'technology', 'specialization'],
      });

      for (const data of dataRows) {
        const [title, level, technology, specialization] = data;
        if (title === '' || level === '' || specialization === '') {
          throw new Error('mandatory fields are missing');
        }

        // check for duplicate question
        const designationAlreadyExists = designations.find(
          (designation) =>
            designation.title.toLowerCase() === title.toLowerCase() &&
            designation.level.toLowerCase() === level.toLowerCase() &&
            designation.specialization.toLowerCase() ===
              specialization.toLowerCase() &&
            designation.technology?.toLowerCase() === technology?.toLowerCase(),
        );

        if (designationAlreadyExists) {
          continue;
        }

        const newDesignation = designationsRepository.create({
          title,
          level,
          technology,
          specialization,
        }) as Designation;

        newDesignations.push(newDesignation);
        designations.push({ title, level, technology, specialization });
      }

      await designationsRepository.save(newDesignations);
    });
  } catch (error) {
    console.log('Error sync_designation: ', error);
    throw error;
  }
});
