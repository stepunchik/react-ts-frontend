import { GET, POST } from '../client';

export function publications() {
    const token = localStorage.getItem('ACCESS_TOKEN');
    return token ? GET('/publications') : GET('/publications/guest');
}

export function createPublication(data: FormData) {
    return POST('/publications', data);
}

export function userPublications(userId: number) {
    return GET(`/publications/${userId}`);
}

export function showPublication(publicationId: string) {
    return GET(`/publications/${publicationId}`);
}
