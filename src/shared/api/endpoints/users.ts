import { GET } from '../client';

export function topUsers() {
    return GET('/users/top');
}

export function getUser(userId: number) {
    return GET(`/users/${userId}`);
}

export function lastWeekTopUsers() {
    return GET('/users/last-week-top');
}

export function currentUser() {
    return GET('/user');
}
