import './profile.scss';

interface StatisticProps {
    userId: number;
}

export const Statistic: React.FC<StatisticProps> = ({ userId }) => {
    return (
        <div className="profile-block">
            <div className="profile-block-text">🏆 Рейтинг: </div>
            <div className="profile-block-text">👍 Лайки: </div>
            <div className="profile-block-text">📢 Публикации: </div>
        </div>
    );
};
