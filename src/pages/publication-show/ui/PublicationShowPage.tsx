import { useLocation, useNavigate, useParams } from 'react-router-dom';

import './publication-show.scss';
import { BackIcon } from '../../../shared/assets/BackIcon';
import { useEffect, useState } from 'react';
import { getUser } from '../../../shared/api/endpoints/users';
import { showPublication } from '../../../shared/api/endpoints/publications';

export const PublicationShowPage = () => {
    const [user, setUser] = useState<any | null>(null);
    const navigate = useNavigate();
    const { id: publicationId } = useParams();
    const publication = useLocation();
    const [post, setPost] = useState<any>(publication.state?.post ?? null);

    useEffect(() => {
        if (!post && publicationId) {
            showPublication(publicationId)
                .then((res) => setPost(res.data.publication))
                .catch(() => setPost(''));
        }
    }, [publicationId]);

    useEffect(() => {
        if (post && post.user_id) {
            getUser(post.user_id)
                .then((res) => setUser(res.data.user))
                .catch(() => setUser(null));
        }
    }, [post]);

    if (!user) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="publication-show-block">
            <div className="user-info-block">
                <div className="back-button" onClick={() => navigate(-1)}>
                    <BackIcon className="back-icon" />
                </div>
                <div className="username">{user.name}</div>
            </div>
            <div className="title">{post.title}</div>
            <p className="show-text">{post.text}</p>
            {post.image && <img className="image" src={post.image} alt={post.title} />}
        </div>
    );
};
