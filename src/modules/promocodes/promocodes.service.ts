import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PromiseResponseDto } from '../../dto/response.dto'
import { PromocodesActivateDto } from './dto/promocodes.activate.dto'
import { PromocodesCreateDto } from './dto/promocodes.create.dto'
import { PromocodesUpdateDto } from './dto/promocodes.update.dto'
import { ActivationResDto, PromocodeResDto } from './dto/promocodes.res.dto'
import { PromocodesRepository } from './promocodes.repository'

@Injectable()
export class PromocodesService {
  constructor(private readonly promocodesRepository: PromocodesRepository) {}

  private parseExpiresAt(value: string | null | undefined): Date | null {
    if (!value) {
      return null
    }
    const date = new Date(value)
    if (date <= new Date()) {
      throw new BadRequestException({ message: 'Срок действия промокода должен быть в будущем' })
    }
    return date
  }

  async createPromocode(dto: PromocodesCreateDto): PromiseResponseDto<PromocodeResDto> {
    const existing = await this.promocodesRepository.findByCode(dto.code)
    if (existing) {
      throw new ConflictException({ message: `Промокод с кодом "${dto.code}" уже существует` })
    }

    const data = await this.promocodesRepository.createPromocode({
      code: dto.code,
      discount: dto.discount,
      activationLimit: dto.activationLimit,
      expiresAt: this.parseExpiresAt(dto.expiresAt) ?? null,
    })

    return { data, message: 'Промокод успешно создан' }
  }

  async updatePromocode(id: string, dto: PromocodesUpdateDto): PromiseResponseDto<PromocodeResDto> {
    if (dto.code) {
      const existing = await this.promocodesRepository.findByCode(dto.code)
      if (existing && existing.id !== id) {
        throw new ConflictException({ message: `Промокод с кодом "${dto.code}" уже существует` })
      }
    }

    const data = await this.promocodesRepository.updatePromocode(id, {
      code: dto.code,
      discount: dto.discount,
      activationLimit: dto.activationLimit,
      expiresAt: this.parseExpiresAt(dto.expiresAt),
    })

    if (!data) {
      throw new NotFoundException({ message: `Промокод с id "${id}" не найден` })
    }

    return { data, message: 'Промокод успешно обновлён' }
  }

  async getPromocodes(limit: number, offset: number): PromiseResponseDto<PromocodeResDto[]> {
    const data = await this.promocodesRepository.getPromocodes({ limit, offset })
    return { data, message: 'Список промокодов успешно получен' }
  }

  async getPromocodeByCode(code: string): PromiseResponseDto<PromocodeResDto> {
    const [data] = await this.promocodesRepository.getPromocodes({ limit: 1, offset: 0, code })

    if (!data) {
      throw new NotFoundException({ message: `Промокод "${code}" не найден` })
    }

    return { data, message: 'Промокод успешно получен' }
  }

  async deletePromocode(id: string): PromiseResponseDto {
    const deleted = await this.promocodesRepository.deletePromocode(id)

    if (!deleted) {
      throw new NotFoundException({ message: `Промокод с id "${id}" не найден` })
    }

    return { message: 'Промокод успешно удалён' }
  }

  async activatePromocode(
    code: string,
    dto: PromocodesActivateDto,
  ): PromiseResponseDto<ActivationResDto> {
    const [promocode] = await this.promocodesRepository.getPromocodes({ limit: 1, offset: 0, code })

    if (!promocode) {
      throw new NotFoundException({ message: `Промокод "${code}" не найден` })
    }

    if (promocode.expiresAt && new Date(promocode.expiresAt) <= new Date()) {
      throw new BadRequestException({ message: 'Срок действия промокода истёк' })
    }

    if (promocode.activationsCount >= promocode.activationLimit) {
      throw new BadRequestException({ message: 'Промокод достиг лимита активаций' })
    }

    const alreadyActivated = await this.promocodesRepository.findActivation(promocode.id, dto.email)

    if (alreadyActivated) {
      throw new ConflictException({
        message: `Email "${dto.email}" уже активировал этот промокод`,
      })
    }

    const data = await this.promocodesRepository.createActivation({
      promocodeId: promocode.id,
      email: dto.email,
    })

    return { data, message: `Промокод активирован. Скидка: ${promocode.discount}%` }
  }
}
