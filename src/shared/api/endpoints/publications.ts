import { DELETE, GET, POST } from '../client';

export function publications() {
    return GET('/publications');
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
