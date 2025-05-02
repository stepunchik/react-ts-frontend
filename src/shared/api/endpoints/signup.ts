import { POST } from '../client';

export function signup({ email, name, sex, birthday, password }: 
    { 
        email: string; 
        name: string; 
        sex: char; 
        birthday: date;
        password: string 
    }) {
    return POST('/signup', { email, name, sex, birthday, password })
    .catch(function (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.config);
    });
}
