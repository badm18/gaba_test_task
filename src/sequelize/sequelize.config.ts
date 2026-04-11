import * as process from 'node:process';
import { PromocodeModel } from "./models/Promocode.model";
import { ActivationModel } from "./models/Activation.model";
import { SequelizeModuleOptions } from '@nestjs/sequelize';


export const sequelizeConfig = {
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  autoLoadModels: false,
  synchronize: false,
  logging: false,
  dialectOptions: {
    statement_timeout: +process.env.POSTGRES_STATEMENT_TIMEOUT,
  },
  pool: {
    max: +process.env.POSTGRES_POOL_MAX,
    min: +process.env.POSTGRES_POOL_MIN,
    acquire: 30000,
    idle: 10000,
  },
  models: [
      PromocodeModel,
      ActivationModel,
  ],
} as SequelizeModuleOptions;


