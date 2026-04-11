import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { PromocodeModel } from '../../sequelize/models/Promocode.model'
import { PromocodesController } from './promocodes.controller'
import { PromocodesRepository } from './promocodes.repository'
import { PromocodesService } from './promocodes.service'

@Module({
  imports: [SequelizeModule.forFeature([PromocodeModel])],
  controllers: [PromocodesController],
  providers: [PromocodesService, PromocodesRepository],
})
export class PromocodesModule {}
