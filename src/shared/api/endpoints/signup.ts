import { POST } from '../client';

export function signup({
    email,
    name,
    // sex,
    // birthday,
    password,
}: {
    email: string;
    name: string;
    // sex: 'M' | 'F';
    // birthday: Date;
    password: string;
}) {
    return POST('/signup', {
        email,
        name,
        // sex,
        // birthday,
        password,
    });
}
