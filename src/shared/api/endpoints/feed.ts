import { GET } from '../client';

export function feed() {
    return GET('/feed');
}
