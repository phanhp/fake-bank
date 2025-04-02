import { config } from 'dotenv';
import { DataSource } from 'typeorm';
config();

const buildDataSource = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5433'),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: ['**/*/*.entity.js'],
    migrations: ['**/*/*.migration.js'],
  });

  return dataSource;
};

export default buildDataSource();
