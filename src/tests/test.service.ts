import { PASSWORD_REGEX, User } from '../models/user';
import { string } from 'joi';
import faker from 'faker';

export async function seedDatabase() {
    await seedUsers(5);
}

async function seedUsers(n: number) {
    await User.destroy({where: {}, force: true});

    for (const i of fill(n)) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();

        await User.create({
            firstName,
            lastName,
            email: faker.internet.email(firstName, lastName),
            phone: faker.phone.phoneNumber(),
            password: 'Password1#',
        });
    }
}

function fill(n: number): number[] {
    const result: number[] = [];

    for (let i = 0; i <= n; i++) {
        result.push(i);
    }
    return result;
}