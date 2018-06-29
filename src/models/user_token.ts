import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, IsUUID } from 'sequelize-typescript';

import { User } from './user';

@Table({
    tableName: 'users_tokens',
    underscored: true,
    timestamps: true,
    paranoid: true,
})

export class UserToken extends Model<UserToken> {
    @PrimaryKey
    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    uuid: string;

    @Column({
        type: DataType.ENUM('invite'),
    })
    type: string;

    @ForeignKey(() => User)
    @IsUUID(4)
    @Column({
        field: 'user_id',
        type: DataType.UUID,
    })
    userId: string;

    @BelongsTo(() => User) user: User;
}
