import { useEffect, useState, useRef } from 'react';
import echo from '@app/services/echo';
import { useParams, useLocation } from 'react-router-dom';
import { createMessage, deleteMessage, updateMessage } from '@shared/api/endpoints/messages';
import { getConversation } from '@shared/api/endpoints/conversations';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import TextareaAutosize from 'react-textarea-autosize';
import './conversations-show.scss';
import { useStateContext } from '@app/providers/ContextProvider';
import { DotIcon } from '@shared/assets/DotIcon';
import { BeatLoader } from 'react-spinners';

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
    const [hasMessages, setHasMessages] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
    const [editedText, setEditedText] = useState<string>('');

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const messagesBoxRef = useRef<HTMLDivElement>(null);

    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        message: ConversationMessage | null;
    } | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!name && conversationId) {
            getConversation(conversationId);
        }
    }, [name, conversationId]);

    useEffect(() => {
        if (!conversationId) return;

        const channel = echo.private(`conversation.${conversationId}`);

        channel.listen('.message.sent', (e: { message: ConversationMessage }) => {
            setMessages((prev) => [...prev, e.message]);
            setHasMessages(true);
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
                const loadedMessages = res.data.messages.data;
                setMessages(
                    loadedMessages.sort(
                        (a: ConversationMessage, b: ConversationMessage) =>
                            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    )
                );

                setHasMessages(loadedMessages.length > 0);
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

    const loadMoreMessages = async () => {
        if (!conversationId || isLoadingMore || !hasMore || !messagesBoxRef.current) return;

        const box = messagesBoxRef.current;
        const prevScrollHeight = box.scrollHeight;

        setIsLoadingMore(true);

        try {
            const res = await getConversation(conversationId, page + 1);
            const newMessages = res.data.messages.data;

            setMessages((prev) =>
                [...newMessages, ...prev].sort(
                    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                )
            );

            setPage((prev) => prev + 1);

            setHasMore(newMessages.length > 0);

            setTimeout(() => {
                const newScrollHeight = box.scrollHeight;
                box.scrollTop = newScrollHeight - prevScrollHeight;
            }, 100);
        } catch (err) {
            console.error('Ошибка при подгрузке сообщений:', err);
        } finally {
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        const box = messagesBoxRef.current;
        if (!box) return;

        const handleScroll = () => {
            if (box.scrollTop < 100 && hasMore && !isLoadingMore) {
                loadMoreMessages();
            }
        };

        box.addEventListener('scroll', handleScroll);
        return () => box.removeEventListener('scroll', handleScroll);
    }, [hasMore, isLoadingMore]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!text.trim()) return;

        const tempId = Date.now();
        const optimisticMessage = {
            id: tempId,
            text,
            sender_id: user!.id,
            created_at: new Date().toISOString(),
            is_read: false,
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setText('');
        setHasMessages(true);

        try {
            await createMessage(text, conversationId!);

            setMessages((prev) => prev.filter((msg) => msg.id !== tempId));

            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
            if (messages.length === 0) {
                setHasMessages(false);
            }
            console.error('Ошибка отправки:', err);
        }
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
                {!isLoading && !hasMessages ? <div className="no-info">Сообщений нет.</div> : null}
                {isLoading && (
                    <div className="loading">
                        <BeatLoader />
                    </div>
                )}
                <div className="messages-box" ref={messagesBoxRef}>
                    {isLoadingMore && (
                        <div className="loading">
                            <BeatLoader />
                        </div>
                    )}
                    {!isLoading &&
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message-container ${
                                    message.sender_id === user?.id ? 'own-container' : ''
                                }`}>
                                {!message.is_read && <DotIcon className="dot-icon" />}

                                <div
                                    className={`message ${
                                        message.sender_id === user?.id ? 'own' : ''
                                    }`}
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
                                    <div className="created-at">
                                        {formatDate(message.created_at)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    <div ref={messagesEndRef} />
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
