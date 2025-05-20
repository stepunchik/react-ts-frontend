import { GET, POST, DELETE } from '../client';

export function getConversations() {
    return GET('/conversations');
}

export function createConversation(name: string, second_user: number) {
    return POST('/conversations', { name, second_user });
}

export function deleteConversation(conversationId: number) {
    return DELETE(`/conversations/${conversationId}`);
}

export function getConversation(conversationId: string) {
    return GET(`/conversations/${conversationId}`);
}
