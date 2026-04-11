import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ActivationModel } from './Activation.model'

export interface IPromocode {
  id: string
  code: string
  discount: number
  activationLimit: number
  expiresAt: Date | null
  createdAt: Date
  updatedAt: Date
}

@Table({ tableName: 'promocodes' })
export class PromocodeModel extends Model<IPromocode> implements IPromocode {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string

  @Column({
    type: DataType.STRING(64),
    allowNull: false,
    unique: true,
  })
  code: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  discount: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'activation_limit',
  })
  activationLimit: number

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'expires_at',
  })
  expiresAt: Date | null

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: 'created_at',
  })
  createdAt: Date

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: 'updated_at',
  })
  updatedAt: Date

  @HasMany(() => ActivationModel)
  activations: ActivationModel[]
}
