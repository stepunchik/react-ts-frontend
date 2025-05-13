import { GET, POST } from '../client';

export function publications() {
    const token = localStorage.getItem('ACCESS_TOKEN');
    return token ? GET('/publications') : GET('/publications/guest');
}

export function createPublication({
    title,
    text,
    image,
}: {
    title: string;
    text: string;
    image: string;
}) {
    return POST('/publications', { title, text, image });
}

export function userPublications(userId: number) {
    return GET(`/publications/${userId}`);
}

export function showPublication(publicationId: number) {
    return GET(`/publications/${publicationId}`);
}
