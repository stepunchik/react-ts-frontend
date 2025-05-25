import { GET, POST } from '../client';

export function topUsers() {
    return GET('/users/top');
}

export function getUser(userId: number) {
    return GET(`/users/${userId}`);
}

export function updateUser(userId: number, data: FormData) {
    return POST(`/users/${userId}`, data);
}

export function lastWeekTopUsers() {
    return GET('/users/last-week-top');
}

export function currentUser() {
    return GET('/user');
}
