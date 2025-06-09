import { LikeIcon } from '@shared/assets/LikeIcon';
import { PublicationIcon } from '@shared/assets/PublicationIcon';

import './statistic.scss';

interface StatisticProps {
    likesQuantity: number;
    publicationsQuantity: number;
}

export const Statistic: React.FC<StatisticProps> = ({ likesQuantity, publicationsQuantity }) => {
    return (
        <div className="profile-block">
            <div className="statistic-block-text">
                <LikeIcon className="icon" />
                <div className="statistic-field">Лайки: {likesQuantity}</div>
            </div>
            <div className="statistic-block-text">
                <PublicationIcon className="icon" />
                <div className="statistic-field">Публикации: {publicationsQuantity}</div>
            </div>
        </div>
    );
};
