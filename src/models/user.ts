import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { UserCompany } from './user_company';
import { Company } from './company';
import { methodNotAllowed, notFound, unauthorized } from 'boom';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

@Table({
    tableName: 'users',
    timestamps: true,
    underscored: true,
    paranoid: true,
})
export class User extends Model<User> {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    uuid: string;

    @Column user_name: string;
    @Column({
        allowNull: false,
        unique: true,
    }) email: string;

    @Column({
        allowNull: false,
        set: function (password) {
            this.setDataValue('password', User.hashPassword(password));
        },
    }) password: string;

    @Column first_name: string;
    @Column last_name: string;
    @Column({
        defaultValue: false,
    }) email_confirmed: boolean;

    @BelongsToMany(() => Company, () => UserCompany)
    companies: Company[];

    static async authenticate(email: string, password: string): Promise<any> {
        const user: User = await User.findOne({where: {email: email}});
        if (!user) throw notFound('User not found!');

        if (!user.email_confirmed) throw methodNotAllowed('Email is not confirmed. You should confirm email first');
        if (user.password !== User.hashPassword(password)) throw unauthorized('Invalid credentials');
        return user;
    }

    static hashPassword(password: string) {
        return crypto
            .createHmac('sha512', process.env.SALT || 'salt')
            .update(password)
            .digest('hex');
    }

    async generateToken(): Promise<any> {
        const salt = process.env.SALT || 'salt';

        const data = {
            user_id: this.uuid,
        };

        return {
            type: 'Bearer',
            expires_in: 86400,
            access_token: jwt.sign(data, salt, {expiresIn: 86400})
        };
    }
}
