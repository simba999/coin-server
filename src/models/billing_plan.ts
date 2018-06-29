import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    IsUUID,
} from 'sequelize-typescript';

@Table({
    tableName: 'billing_plans',
    underscored: true,
    timestamps: true,
    paranoid: true,
})

export class BillingPlan extends Model<BillingPlan> {
    @PrimaryKey
    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    uuid: string;

    @Column name: string;
    @Column code: string;

    @Column period: number;
}
