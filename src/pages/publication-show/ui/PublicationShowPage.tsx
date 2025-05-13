import { useLocation, useNavigate } from 'react-router-dom';

import './publication-show.scss';
import { BackIcon } from '../../../shared/assets/BackIcon';
import { useEffect, useState } from 'react';
import { getUser } from '../../../shared/api/endpoints/users';

export const PublicationShowPage = () => {
    const [user, setUser] = useState<any | null>(null);
    const navigate = useNavigate();
    const publication = useLocation();
    const post = publication.state.post;

    useEffect(() => {
        getUser(post.user_id).then((res) => setUser(res.data));
    }, []);

    if (!user) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="publication-show-block">
            <div className="user-info-block">
                <div className="back-button" onClick={() => navigate(-1)}>
                    <BackIcon className="icon" />
                </div>
                <div>{user.name}</div>
            </div>
            <div className="title">{post.title}</div>
            <p className="show-text">{post.text}</p>
            <img className="image" src={post.image} alt={post.title} />
        </div>
    );
};
