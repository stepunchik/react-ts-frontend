import { POST, PATCH, DELETE } from '../client';

export function like(publicationId: number) {
    return POST(`/publications/${publicationId}/like`);
}

export function dislike(publicationId: number) {
    return POST(`/publications/${publicationId}/dislike`);
}

export function updateGrade(postId: number, value: number) {
    return PATCH(`/publications/${postId}/grade`, { value });
}

export function deleteGrade(publicationId: number) {
    return DELETE(`/publications/${publicationId}/grade`);
}
