import { GET } from '../client';

export function currentUser() {
    return GET('/user')
}
