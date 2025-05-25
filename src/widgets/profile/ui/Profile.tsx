import { useEffect, useState } from 'react';
import { LogoutButton } from '../../../features/auth';
import { BirthdayIcon } from '../../../shared/assets/BirthdayIcon';
import { EmailIcon } from '../../../shared/assets/EmailIcon';
import { SexIcon } from '../../../shared/assets/SexIcon';
import { Feed } from '../../feed';

import './profile.scss';
import { useStateContext } from '../../../app/providers/ContextProvider';
import { getUser } from '../../../shared/api/endpoints/users';
import { CreateConversationButton } from '../../../features/conversation/conversation-button';
import { Statistic } from '../../statistic';
import { EditIcon } from '../../../shared/assets/EditIcon';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
    userId: number;
}

export const Profile: React.FC<ProfileProps> = ({ userId }) => {
    const [user, setUser] = useState<any | null>(null);
    const [likesQuantity, setLikesQunatity] = useState(0);
    const [publicationsQuantity, setPublicationsQuantity] = useState(0);
    const { user: currentUser } = useStateContext();
    const navigate = useNavigate();

    useEffect(() => {
        getUser(userId).then((res) => {
            setUser(res.data.user);
            setLikesQunatity(res.data.likes_quantity);
            setPublicationsQuantity(res.data.publications_quantity);
        });
    }, [userId]);

    if (!user) {
        return <div>Загрузка...</div>;
    }

    const isOwnProfile = currentUser?.id === user.id;

    const handleEditButtonClick = (id: number, user: any) => {
        navigate(`/users/${id}/edit`, { state: { user } });
    };

    return (
        <div className="profile">
            <div className="main-profile-block">
                <img className="profile-image" src={user.image} alt={user.name} />
                <div className="user-edit-block">
                    <h1 className="username">{user.name}</h1>
                    {isOwnProfile && (
                        <EditIcon
                            className="profile-edit-icon"
                            onClick={() => handleEditButtonClick(user.id, user)}
                        />
                    )}
                </div>
                <div className="profile-button-block">
                    {isOwnProfile && <LogoutButton style="secondary-button" />}
                    {!isOwnProfile && (
                        <CreateConversationButton
                            name={user.name}
                            second_user={user.id}
                            _className="secondary-button"
                        />
                    )}
                </div>
            </div>
            <div className="profile-info">
                <div className="profile-block">
                    <div className="profile-block-text about-title">Обо мне</div>
                    <div className="profile-block-item">
                        <SexIcon className="icon" />
                        <div className="profile-block-text">
                            {user.sex
                                ? user.sex === 'M'
                                    ? 'Мужской'
                                    : 'Женский'
                                : 'Пол не указан'}
                        </div>
                    </div>
                    <div className="profile-block-item">
                        <BirthdayIcon className="icon" />
                        <div className="profile-block-text">
                            {user.birthday || 'Дата рождения не указанa'}
                        </div>
                    </div>
                    <div className="profile-block-item">
                        <EmailIcon className="icon" />
                        <div className="profile-block-text">{user.email || 'email не указан'}</div>
                    </div>
                </div>
                <div className="posts-block">
                    <Feed userProfileId={userId} />
                </div>
                <Statistic
                    likesQuantity={likesQuantity}
                    publicationsQuantity={publicationsQuantity}
                />
            </div>
        </div>
    );
};
