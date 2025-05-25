import { DELETE, GET, POST } from '../client';

export function publications() {
    const token = localStorage.getItem('ACCESS_TOKEN');
    return token ? GET('/publications') : GET('/publications/guest');
}

export function createPublication(data: FormData) {
    return POST('/publications', data);
}

export function updatePublication(data: FormData, publicationId: string) {
    return POST(`/publications/${publicationId}`, data);
}

export function userPublications(userId: number) {
    return GET(`users/${userId}/publications`);
}

export function showPublication(publicationId: string) {
    return GET(`/publications/${publicationId}`);
}

export function deletePublication(publicationId: number) {
    return DELETE(`/publications/${publicationId}`);
}
