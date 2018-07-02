import {
    Table,
    Column,
    Model,
    DataType,
    BelongsTo,
    ForeignKey,
    PrimaryKey,
    IsUUID,
} from 'sequelize-typescript';
import { Security } from './security';
import { Shareholder } from './shareholder';

@Table({
    tableName: 'securities_transactions',
    underscored: true,
    timestamps: true,
    paranoid: true,
})
export class SecurityTransaction extends Model<SecurityTransaction> {
    @PrimaryKey
    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    uuid: string;

    @Column status: boolean;
    @Column shares: number;

    @Column price: number; // cents

    @Column({
        defaultValue: false,
        allowNull: false,
    }) restricted: boolean;

    @Column({
        type: DataType.DATE,
        field: 'restricted_until',
        allowNull: true,
    })
    restrictedUntil: Date;

    @Column({
        field: 'issue_date',
        type: DataType.DATE,
    })
    issueDate: string;

    @ForeignKey(() => Security)
    @IsUUID(4)
    @Column({
        field: 'security_id',
        type: DataType.UUID,
    })
    securityId: string;

    @ForeignKey(() => Shareholder)
    @Column({
        field: 'shareholder_id',
        type: DataType.UUID,
    })
    shareholderId: string;

    @BelongsTo(() => Security) security: Security;
    @BelongsTo(() => Shareholder) shareholder: Shareholder;
}
