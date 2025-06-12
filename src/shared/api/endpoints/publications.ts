import { DELETE, GET, POST } from '../client';

export function publications(page = 1) {
    return GET('/publications', { params: { page } });
}

export function userPublications(userId: number, page = 1) {
    return GET(`users/${userId}/publications`, { params: { page } });
}

export function createPublication(data: FormData) {
    return POST('/publications', data);
}

export function updatePublication(data: FormData, publicationId: string) {
    return POST(`/publications/${publicationId}`, data);
}

export function showPublication(publicationId: string) {
    return GET(`/publications/${publicationId}`);
}

export function deletePublication(publicationId: number) {
    return DELETE(`/publications/${publicationId}`);
}
