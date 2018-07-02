import { Table, Column, Model, DataType, HasOne, HasMany, IsEmail, PrimaryKey, IsUUID, Is } from 'sequelize-typescript';
import { methodNotAllowed, notFound, unauthorized } from 'boom';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { Shareholder } from './shareholder';
import { UserToken } from './user_token';
import { BillingSubscription } from './billing_subscription';

export const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[$&+,:;=?@#|'<>.^*()%!-]).{6,}$/;

export enum UserRole {
    /**
     * Owner - This is the user type that creates the account. * They have full access including access to Billing.
     * They are able to create and invite other user types
     */
    owner,
    /**
     * Employee - This is a user with limited access. They are typically invited when they have been issued stock.
     * They can login and view their holdings and company info that an Owner allows.
     */
    employee,
    /** Shareholder - this is a user who’s been granted a security by the company but is not an employee.
     * Owner decides what info a shareholder has access to. Use case: This could be an investor or a past employee.
     */
    shareholder,
    /**
     * Board Member - This is a user type probably with more access than other user types.
     * Might have to approve certain actions - a function we will build into the platform.
     */
    boardMember
}

@Table({
    tableName: 'users',
    underscored: true,
    timestamps: true,
    paranoid: true,
})

export class User extends Model<User> {
    @PrimaryKey
    @IsUUID(4)
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    uuid: string;

    @Column({
        allowNull: false,
        unique: true,
    })
    email: string;

    @Column({
        allowNull: false,
        set: function (password) {
            this.setDataValue('password', User.hashPassword(password));
        },
    })
    password: string;

    @Column({
        field: 'first_name',
    })
    firstName: string;

    @Column({
        field: 'last_name',
    })
    lastName: string;

    @Column({
        field: 'email_confirmed',
        defaultValue: false,
    })
    emailConfirmed: boolean;

    @HasOne(() => Shareholder) shareholder: Shareholder;
    @HasMany(() => BillingSubscription) subscriptions: BillingSubscription;
    @HasMany(() => UserToken) tokens: UserToken;

    static hashPassword(password: string) {
        return crypto
            .createHmac('sha512', process.env.SALT || 'salt')
            .update(password)
            .digest('hex');
    }

    async generateToken(): Promise<any> {
        const salt = process.env.SALT || 'ishu';

        const data = {
            userId: this.uuid,
        };

        return {
            type: 'Bearer',
            expiresIn: 86400,
            accessToken: jwt.sign(data, salt, {expiresIn: 86400})
        };
    }
}
