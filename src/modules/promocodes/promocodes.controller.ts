import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { promocodesCreateSchema } from './schemas/promocodes.create.schema'
import { promocodesUpdateSchema } from './schemas/promocodes.update.schema'
import { promocodesActivateSchema } from './schemas/promocodes.activate.schema'
import { PromocodesService } from './promocodes.service'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'
import { PromocodesCreateDto } from './dto/promocodes.create.dto'
import { PromocodesUpdateDto } from './dto/promocodes.update.dto'
import { PromocodesActivateDto } from './dto/promocodes.activate.dto'

@Controller('promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

  @Post()
  createPromocode(
    @Body(new ZodValidationPipe(promocodesCreateSchema)) dto: PromocodesCreateDto,
  ) {
    return this.promocodesService.createPromocode(dto)
  }

  @Get()
  getPromocodes(
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
  ) {
    return this.promocodesService.getPromocodes(Number(limit), Number(offset))
  }

  @Get(':code')
  getPromocodeByCode(@Param('code') code: string) {
    return this.promocodesService.getPromocodeByCode(code)
  }

  @Put(':id')
  updatePromocode(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(promocodesUpdateSchema)) dto: PromocodesUpdateDto,
  ) {
    return this.promocodesService.updatePromocode(id, dto)
  }

  @Delete(':id')
  deletePromocode(@Param('id') id: string) {
    return this.promocodesService.deletePromocode(id)
  }

  @Post(':code/activate')
  activatePromocode(
    @Param('code') code: string,
    @Body(new ZodValidationPipe(promocodesActivateSchema)) dto: PromocodesActivateDto,
  ) {
    return this.promocodesService.activatePromocode(code, dto)
  }
}
