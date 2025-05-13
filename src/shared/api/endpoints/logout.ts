import { POST } from '../client';

export function logout() {
    return POST('/logout');
}
