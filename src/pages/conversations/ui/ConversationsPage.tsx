import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConversations } from '../../../shared/api/endpoints/conversations';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import echo from '../../../app/services/echo';

import './conversations.scss';
import { useStateContext } from '../../../app/providers/ContextProvider';

interface ConversationMessage {
    id: number;
    text: string;
    conversation_id: number;
    sender_id: number;
    created_at: string;
    is_read: boolean;
}

export const ConversationsPage = () => {
    const { user: currentUser } = useStateContext();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState<any[]>([]);
    const [unreadMessages, setUnreadMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getConversations()
            .then(({ data }) => {
                setConversations(data.conversations);
                setUnreadMessages(data.unread_messages);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        const userId = currentUser.id;

        const userChannel = echo.private(`user.${userId}`);

        userChannel.listen('.message.sent', (event: { message: ConversationMessage }) => {
            const message = event.message;

            setConversations((prev) => {
                let updated = prev.map((c) => {
                    if (c.id === message.conversation_id) {
                        return { ...c, latest_message: message };
                    }
                    return c;
                });

                const isNew = updated.find((c) => c.id === message.conversation_id);
                if (!isNew) {
                    getConversations();
                }

                updated = updated.sort((a, b) => {
                    const timeA = new Date(a.latest_message?.created_at || 0).getTime();
                    const timeB = new Date(b.latest_message?.created_at || 0).getTime();
                    return timeB - timeA;
                });

                return updated;
            });
        });

        userChannel.listen('.message.updated', (e: any) => {
            const updatedMessage = e.message;

            setConversations((prev) => {
                return prev.map((conversation) => {
                    if (
                        conversation.id === updatedMessage.conversation_id &&
                        conversation.latest_message &&
                        conversation.latest_message.id === updatedMessage.id
                    ) {
                        return {
                            ...conversation,
                            latest_message: {
                                ...conversation.latest_message,
                                ...updatedMessage,
                            },
                        };
                    }

                    return conversation;
                });
            });
        });

        return () => {
            echo.leave(`user.${userId}`);
        };
    }, [currentUser.id]);

    const handleConversationClick = (id: number, name: string) => {
        navigate(`/conversations/${id}`, { state: { name } });
    };

    function formatDate(dateString: string): string {
        const date = parseISO(dateString);

        if (isToday(date)) {
            return `сегодня в ${format(date, 'HH:mm')}`;
        }

        if (isYesterday(date)) {
            return `вчера в ${format(date, 'HH:mm')}`;
        }

        return format(date, "d MMMM yyyy 'в' HH:mm", { locale: ru });
    }

    return (
        <div className="conversations-list">
            {conversations.length == 0 && !isLoading ? (
                <div className="no-info">Диалогов нет.</div>
            ) : null}
            {isLoading && <div className="loading">Загрузка...</div>}
            {!isLoading &&
                conversations.map((conversation) => (
                    <div
                        key={conversation.id}
                        className="conversation-block"
                        onClick={() => handleConversationClick(conversation.id, conversation.name)}>
                        <div className="title">
                            {conversation.id} {conversation.name}
                        </div>
                        {conversation.latest_message && (
                            <div className="latest-message-block">
                                <div className="last-message">
                                    {conversation.latest_message.sender_id === currentUser.id
                                        ? 'Вы: '
                                        : `${conversation.name}: `}
                                    {conversation.latest_message.text}
                                </div>
                                <div className="message-info-block">
                                    <div className="created_at">
                                        {formatDate(conversation.latest_message.created_at)}
                                    </div>
                                    {unreadMessages[conversation.id] > 0 && (
                                        <div className="unread-count">
                                            {unreadMessages[conversation.id]}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );
};
