import { Module } from '@nestjs/common'
import appConfig from './configs/app.config'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { PromocodesModule } from './modules/promocodes/promocodes.module'
import { envSchema } from './configs/env.schema'
import { sequelizeConfig } from "./sequelize/sequelize.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validate: (config) => {
        const result = envSchema.safeParse(config)
        if (!result.success) {
          throw new Error(`Config validation error: ${result.error.message}`)
        }
        return result.data
      },
    }),
    SequelizeModule.forRoot(sequelizeConfig),
    PromocodesModule,
  ],
})
export class AppModule {}
