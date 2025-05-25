import { useEffect, useState } from 'react';
import echo from '../../../app/services/echo';
import { useParams, useLocation } from 'react-router-dom';
import {
    createMessage,
    deleteMessage,
    updateMessage,
} from '../../../shared/api/endpoints/messages';
import { getConversation } from '../../../shared/api/endpoints/conversations';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import TextareaAutosize from 'react-textarea-autosize';
import './conversations-show.scss';
import { useStateContext } from '../../../app/providers/ContextProvider';

interface ConversationMessage {
    id: number;
    text: string;
    sender_id: number;
    created_at: string;
    is_read: boolean;
}

export const ConversationsShowPage = () => {
    const { user } = useStateContext();
    const { id: conversationId } = useParams();
    const [text, setText] = useState<string>('');
    const [messages, setMessages] = useState<ConversationMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const conversationName = useLocation();
    const [name, setName] = useState<string>(conversationName.state?.name);

    const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
    const [editedText, setEditedText] = useState<string>('');

    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        message: ConversationMessage | null;
    } | null>(null);

    useEffect(() => {
        if (!name && conversationId) {
            getConversation(conversationId)
                .then((res) => setName(res.data.conversation.name))
                .catch(() => setName('Без названия'));
        }
    }, [name, conversationId]);

    useEffect(() => {
        if (!conversationId) return;

        const channel = echo.private(`conversation.${conversationId}`);

        channel.listen('.message.sent', (e: { message: ConversationMessage }) => {
            setMessages((prev) => [...prev, e.message]);
        });

        channel.listen('.message.updated', (e: { message: ConversationMessage }) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === e.message.id ? { ...msg, text: e.message.text } : msg
                )
            );
        });

        channel.listen('.message.deleted', (e: { messageId: number }) => {
            setMessages((prev) => prev.filter((msg) => msg.id !== e.messageId));
        });

        return () => {
            echo.leave(`conversation.${conversationId}`);
        };
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId) return;
        setIsLoading(true);

        getConversation(conversationId)
            .then((res) => {
                setMessages(res.data.messages);
            })
            .catch((err) => {
                console.error('Ошибка загрузки сообщений:', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await createMessage(text, conversationId)
            .then(() => {
                setText('');
            })
            .catch((err) => {
                console.error('Ошибка отправки сообщения:', err);
            });
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

    function handleRightClick(e: React.MouseEvent<HTMLDivElement>, message: ConversationMessage) {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            message,
        });
    }

    const handleDeleteMessage = (id: number) => {
        deleteMessage(id)
            .then(() => {})
            .catch((err) => {
                console.error('Ошибка удаления сообщения', err);
            })
            .finally(() => setContextMenu(null));
    };

    const startEditing = (message: ConversationMessage) => {
        setEditingMessageId(message.id);
        setEditedText(message.text);
        setContextMenu(null);
    };

    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, messageId: number) => {
        if (e.key === 'Enter') {
            handleSaveEditedMessage(messageId);
        } else if (e.key === 'Escape') {
            setEditingMessageId(null);
        }
    };

    const handleSaveEditedMessage = async (id: number) => {
        await updateMessage(id, { text: editedText })
            .then(() => {
                setEditingMessageId(null);
            })
            .catch((err) => {
                console.error('Ошибка редактирования сообщения:', err);
            });
    };

    return (
        <div>
            <div className="conversation-container">
                <div className="title conversation-title">{name}</div>
                {messages.length == 0 && !isLoading ? (
                    <div className="no-info">Сообщений нет.</div>
                ) : null}
                {isLoading && <div className="loading">Загрузка...</div>}
                <div className="messages-box">
                    {!isLoading &&
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message ${message.sender_id === user?.id ? 'own' : ''}`}
                                onContextMenu={(e) => handleRightClick(e, message)}>
                                {editingMessageId === message.id ? (
                                    <input
                                        className="edit-input"
                                        type="text"
                                        value={editedText}
                                        onChange={(e) => setEditedText(e.target.value)}
                                        onKeyDown={(e) => handleEditKeyDown(e, message.id)}
                                        autoFocus
                                        onBlur={() => setEditingMessageId(null)}
                                    />
                                ) : (
                                    <p className="text">{message.text}</p>
                                )}
                                <div className="created-at">{formatDate(message.created_at)}</div>
                            </div>
                        ))}
                </div>
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
                        {contextMenu.message?.sender_id === user.id && (
                            <div
                                className="context-menu-item"
                                onClick={() => {
                                    if (!contextMenu.message) return;
                                    startEditing(contextMenu.message);
                                }}>
                                Редактировать
                            </div>
                        )}
                        <div
                            className="context-menu-item"
                            onClick={() => {
                                if (!contextMenu.message) return;
                                handleDeleteMessage(contextMenu.message.id);
                            }}>
                            Удалить
                        </div>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="send-message-form">
                    <TextareaAutosize
                        className="message-textarea"
                        value={text}
                        onChange={handleChange}
                        rows={1}
                    />
                    <button type="submit" className="button form-button">
                        Отправить
                    </button>
                </form>
            </div>
        </div>
    );
};
