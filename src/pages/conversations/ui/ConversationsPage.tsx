import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConversations } from '../../../shared/api/endpoints/conversations';

import './conversations.scss';

export const ConversationsPage = () => {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getConversations()
            .then(({ data }) => {
                setConversations(data.conversations);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    }, []);

    const handleConversationClick = (id: number, name: string) => {
        navigate(`/conversations/${id}`, { state: { name } });
    };

    return (
        <div className="conversations-list">
            {conversations.length == 0 && !isLoading ? <div>Диалогов нет.</div> : null}
            {isLoading && <div className="loading">Загрузка...</div>}
            {!isLoading &&
                conversations.map((conversation) => (
                    <div
                        key={conversation.id}
                        className="conversation-block"
                        onClick={() => handleConversationClick(conversation.id, conversation.name)}>
                        <div className="title">{conversation.name}</div>
                    </div>
                ))}
        </div>
    );
};
