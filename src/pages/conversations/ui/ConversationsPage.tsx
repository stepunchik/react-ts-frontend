import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteConversation, getConversations } from '../../../shared/api/endpoints/conversations';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import echo from '../../../app/services/echo';

import './conversations.scss';
import { useStateContext } from '../../../app/providers/ContextProvider';
import ReactModal from 'react-modal';

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
    const [unreadMessages, setUnreadMessages] = useState<Record<number, number>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState<number | null>(null);

    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        conversationId: number | null;
    } | null>(null);

    function handleRightClick(e: React.MouseEvent<HTMLDivElement>, conversationId: number) {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            conversationId,
        });
    }

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

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
        if (!currentUser?.id) return;

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

            setUnreadMessages((prev) => {
                const isOwnMessage = message.sender_id === currentUser.id;
                if (isOwnMessage) return prev;

                return {
                    ...prev,
                    [message.conversation_id]: (prev[message.conversation_id] || 0) + 1,
                };
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
    }, [currentUser?.id]);

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

    const openDeleteModal = (id: number) => {
        setConversationToDelete(id);
        setContextMenu(null);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (conversationToDelete === null) return;

        deleteConversation(conversationToDelete)
            .then(() => {
                setConversations((prev) => prev.filter((c) => c.id !== conversationToDelete));
            })
            .catch((err) => {
                console.error('Ошибка при удалении диалога.', err);
            })
            .finally(() => {
                setConversationToDelete(null);
                setIsModalOpen(false);
            });
    };

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
                        onClick={() =>
                            handleConversationClick(
                                conversation.id,
                                conversation.first_user.id !== currentUser.id
                                    ? conversation.first_user.name
                                    : conversation.second_user.name
                            )
                        }
                        onContextMenu={(e: React.MouseEvent<HTMLDivElement>) =>
                            handleRightClick(e, conversation.id)
                        }>
                        <div className="title">
                            {conversation.first_user.id !== currentUser.id
                                ? conversation.first_user.name
                                : conversation.second_user.name}
                        </div>
                        {conversation.latest_message && (
                            <div className="latest-message-block">
                                <div className="last-message">
                                    {conversation.latest_message.sender_id === currentUser.id
                                        ? 'Вы: '
                                        : conversation.first_user.id !== currentUser.id
                                        ? conversation.first_user.name + ': '
                                        : conversation.second_user.name + ': '}
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
            {contextMenu && (
                <div
                    className="context-menu"
                    style={{
                        top: contextMenu.y,
                        left: contextMenu.x,
                        position: 'absolute',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        padding: '8px',
                        zIndex: 1000,
                    }}
                    onClick={(e) => e.stopPropagation()}>
                    <div
                        className="context-menu-item"
                        onClick={() => {
                            if (!contextMenu.conversationId) return;
                            openDeleteModal(contextMenu.conversationId);
                        }}>
                        Удалить
                    </div>
                </div>
            )}

            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Подтверждение удаления"
                className="modal delete-modal">
                <h2>Удалить диалог?</h2>
                <p>Вы уверены, что хотите удалить этот диалог? Это действие нельзя отменить.</p>
                <div className="modal-buttons">
                    <button onClick={confirmDelete} className="confirm-btn">
                        Удалить
                    </button>
                    <button onClick={() => setIsModalOpen(false)} className="cancel-btn">
                        Отмена
                    </button>
                </div>
            </ReactModal>
        </div>
    );
};
