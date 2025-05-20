import { POST, DELETE } from '../client';

export function createMessage(text: string, conversation_id: string | undefined) {
    return POST('/messages', { text, conversation_id });
}

export function deleteConversation(messageId: number) {
    return DELETE(`/messages/${messageId}`);
}
