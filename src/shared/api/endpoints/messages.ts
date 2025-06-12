import { POST, DELETE, PATCH } from '../client';

export function createMessage(text: string, conversation_id: string | undefined) {
    return POST('/messages', { text, conversation_id });
}

export function deleteMessage(messageId: number) {
    return DELETE(`/messages/${messageId}`);
}

export function updateMessage(messageId: number, data: any) {
    return POST(`/messages/${messageId}`, data);
}
