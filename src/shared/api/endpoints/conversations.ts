import { GET, POST, DELETE } from '../client';

export function conversations() {
    return GET('/conversations');
}

export function createConversation({ name, secondUserId }: { name: string; secondUserId: number }) {
    return POST('/conversations', { name, secondUserId });
}

export function deleteConversation(conversationId: number) {
    return DELETE(`/conversations/${conversationId}`);
}

export function getConversationMessages(conversationId: number) {
    return GET(`/conversations/${conversationId}`);
}
