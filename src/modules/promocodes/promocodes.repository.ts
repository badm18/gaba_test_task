import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'
import { QueryTypes, Sequelize } from 'sequelize'
import { PromocodeModel } from '../../sequelize/models/Promocode.model'
import { ActivationResDto, PromocodeResDto } from './dto/promocodes.res.dto'
import {
    GetPromocodesParams,
    UpdatePromocodeParams,
    CreatePromocodeParams,
    CreateActivationParams,
} from './interfaces/promocodes.repository.interfaces'

@Injectable()
export class PromocodesRepository {
  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @InjectModel(PromocodeModel)
    private readonly promocodeModel: typeof PromocodeModel,
  ) {}

  async createPromocode(params: CreatePromocodeParams): Promise<PromocodeResDto> {
    const promocode = await this.promocodeModel.create(params)

    return {
      id: promocode.id,
      code: promocode.code,
      discount: promocode.discount,
      activationLimit: promocode.activationLimit,
      activationsCount: 0,
      expiresAt: promocode.expiresAt?.toISOString() ?? null,
      createdAt: promocode.createdAt.toISOString(),
    }
  }

  async updatePromocode(id: string, params: UpdatePromocodeParams): Promise<PromocodeResDto | null> {
    const [, [promocode]] = await this.promocodeModel.update({
      code: params.code,
      discount: params.discount,
      activationLimit: params.activationLimit,
      expiresAt: params.expiresAt,
    }, {
      where: { id },
      returning: true,
    })

    if (!promocode) {
      return null
    }

    return {
      id: promocode.id,
      code: promocode.code,
      discount: promocode.discount,
      activationLimit: promocode.activationLimit,
      activationsCount: 0,
      expiresAt: promocode.expiresAt?.toISOString() ?? null,
      createdAt: promocode.createdAt.toISOString(),
    }
  }

  async findByCode(code: string): Promise<{ id: string } | null> {
    const [row] = await this.sequelize.query<{ id: string }>(
      `SELECT id FROM promocodes WHERE code = :code`,
      {
        type: QueryTypes.SELECT,
        replacements: {
        code
      }
      },
    )
    return row ?? null
  }

  async getPromocodes(params: GetPromocodesParams): Promise<PromocodeResDto[]> {
    const where = params.code ? `WHERE code = :code` : ''

    const promocodes = await this.sequelize.query<Omit<PromocodeResDto, 'activationsCount'>>(
      `SELECT 
            id,
            code,
            discount,
            activation_limit AS "activationLimit",
            expires_at AS "expiresAt",
            created_at AS "createdAt"
       FROM promocodes
       ${where}
       ORDER BY created_at DESC
       LIMIT :limit 
       OFFSET :offset`,
      {
          type: QueryTypes.SELECT,
          replacements: {
              code: params.code,
              limit: params.limit > 100 ? 100 : params.limit,
              offset: params.offset,
          }
      },
    )

    if (!promocodes.length) {
        return []
    }

    const counts = await this.sequelize.query<{ promocodeId: string; count: number }>(
      `SELECT promocode_id AS "promocodeId", COUNT(id)::int AS count
       FROM activations
       WHERE promocode_id IN (:ids)
       GROUP BY promocode_id`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          ids: promocodes.map((p) => p.id)
        }
      },
    )

    const countMap = new Map(counts.map((c) => [c.promocodeId, c.count]))

    return promocodes.map((p) => ({ ...p, activationsCount: countMap.get(p.id) ?? 0 }))
  }

  async deletePromocode(id: string): Promise<boolean> {
    const deleted = await this.promocodeModel.destroy({ where: { id } })
    return deleted > 0
  }

  async findActivation(promocodeId: string, email: string): Promise<boolean> {
    const [row] = await this.sequelize.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM activations WHERE promocode_id = :promocodeId AND email = :email`,
      {
        type: QueryTypes.SELECT,
        replacements: {
            promocodeId,
            email
        },
      },
    )

    return Number(row.count) > 0
  }

  async createActivation(params: CreateActivationParams): Promise<ActivationResDto> {
    const [data] = await this.sequelize.query<ActivationResDto>(
      `
      INSERT INTO activations (id, promocode_id, email, created_at, updated_at)
      VALUES (gen_random_uuid(), :promocodeId, :email, NOW(), NOW())
      RETURNING
        id,
        promocode_id AS "promocodeId",
        email,
        created_at AS "createdAt"
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          promocodeId: params.promocodeId,
          email: params.email,
        },
      },
    )

    return data
  }
}
