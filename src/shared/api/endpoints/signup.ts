import { POST } from '../client';

export function signup({ email, name, sex, birthday, password }: 
    { 
        email: string; 
        name: string; 
        sex: char; 
        birthday: date;
        password: string 
    }) {
    return POST('/signup', { email, name, sex, birthday, password });
}
