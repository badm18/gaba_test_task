import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { PromocodeModel } from './Promocode.model'

export interface IActivation {
  id: string
  promocodeId: string
  email: string
  createdAt: Date
  updatedAt: Date
}

@Table({ tableName: 'activations' })
export class ActivationModel extends Model<IActivation> implements IActivation {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string

  @ForeignKey(() => PromocodeModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'promocode_id',
  })
  promocodeId: string

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  email: string

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

  @BelongsTo(() => PromocodeModel)
  promocode: PromocodeModel
}
