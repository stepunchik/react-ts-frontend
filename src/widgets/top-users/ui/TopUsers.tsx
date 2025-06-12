import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import './top-users.scss';
import { lastWeekTopUsers, topUsers } from '@shared/api/endpoints/users';
import { BeatLoader } from 'react-spinners';

export const TopUsers = () => {
    const [top, setTop] = useState<any[]>([]);
    const [lastWeekTop, setLastWeekTop] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        topUsers()
            .then((res) => {
                setTop(res.data.top);
            })
            .catch((err) => {
                console.error('Ошибка загрузки топа пользователей:', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
        lastWeekTopUsers()
            .then((res) => {
                setLastWeekTop(res.data.last_week_top);
            })
            .catch((err) => {
                console.error('Ошибка загрузки топа пользователей:', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="top-column">
            <div className="top">
                <div className="top-title">Топ пользователей</div>
                {isLoading && (
                    <div className="loading">
                        <BeatLoader />
                    </div>
                )}
                {!isLoading &&
                    top.map((user) => (
                        <div key={user.id} className="top-item">
                            <img className="top-image" src={user.image} alt={user.name} />
                            <Link className="username top-username" to={`/users/${user.id}`}>
                                {user.name}
                            </Link>
                            <div className="user-rating">👍 {user.total_likes}</div>
                        </div>
                    ))}
            </div>
            <div className="top">
                <div className="top-text-block">
                    <div className="top-title">Топ пользователей</div>
                    <p className="top-text">за последнюю неделю</p>
                </div>
                {isLoading && (
                    <div className="loading">
                        <BeatLoader />
                    </div>
                )}
                {!isLoading &&
                    lastWeekTop.map((user) => (
                        <div key={user.id} className="top-item">
                            <img className="top-image" src={user.image} alt={user.name} />
                            <Link className="username top-username" to={`/users/${user.id}`}>
                                {user.name}
                            </Link>
                            <div className="user-rating">👍 {user.total_likes}</div>
                        </div>
                    ))}
            </div>
        </div>
    );
};
