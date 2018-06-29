import { Table, Column, Model, DataType, BelongsToMany, HasMany, PrimaryKey, IsUUID } from 'sequelize-typescript';
import { Security } from './security';
import { ShareholderAccount } from './shareholder_account';
import { Shareholder } from './shareholder';

@Table({
    tableName: 'accounts',
    underscored: true,
    timestamps: true,
    paranoid: true,
})
export class Account extends Model<Account> {
    @PrimaryKey
    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    uuid: string;

    @Column({
        type: DataType.ENUM('company')
    })
    type: string;

    @Column name: string;

    @HasMany(() => Security) securities: Security[];
    @BelongsToMany(() => Shareholder, () => ShareholderAccount) shareholder: Shareholder[];
}
