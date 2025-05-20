import { useEffect, useState } from 'react';
import echo from '../../../app/services/echo';
import { useParams, useLocation } from 'react-router-dom';
import { createMessage } from '../../../shared/api/endpoints/messages';
import { getConversation } from '../../../shared/api/endpoints/conversations';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

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
    const [name, setName] = useState<string>(conversationName.state?.name ?? 'Загрузка...');

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
            console.log(e.message);
            setMessages((prev) => [...prev, e.message]);
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
                                className={`message ${
                                    message.sender_id === user?.id ? 'own' : ''
                                }`}>
                                <p className="text">{message.text}</p>
                                <div className="created-at">{formatDate(message.created_at)}</div>
                            </div>
                        ))}
                </div>
                <form onSubmit={handleSubmit} className="send-message-form">
                    <input type="text" value={text} onChange={handleChange} />
                    <button type="submit" className="button form-button">
                        Отправить
                    </button>
                </form>
            </div>
        </div>
    );
};
