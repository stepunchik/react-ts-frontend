import { Feed } from '../../../widgets/feed';
import { TopUsers } from '../../../widgets/top-users';

import './feed-page.scss';

export const FeedPage = () => {
    return (
        <div className="feed-page">
            <div className="feed-layout">
                <Feed />
                <TopUsers />
            </div>
        </div>
    );
};
