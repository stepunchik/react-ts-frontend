import { createBrowserRouter } from 'react-router-dom';
import { FeedPage } from '../../pages/feed';
import { ProfilePage } from '../../pages/profile';
import { PublicationEditPage } from '../../pages/publication-edit';
import { MainLayout } from '../layouts/MainLayout';
import { NotFoundPage } from '../../pages/not-found';
import { ConversationsPage } from '../../pages/conversations';
import { PublicationShowPage } from '../../pages/publication-show';
import { PublicationCreatePage } from '../../pages/publication-create';
import { ConversationsShowPage } from '../../pages/conversations-show';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <FeedPage />,
            },
            {
                path: '/conversations',
                element: <ConversationsPage />,
            },
            {
                path: '/conversations/:id',
                element: <ConversationsShowPage />,
            },
            {
                path: '/users/:id',
                element: <ProfilePage />,
            },
            {
                path: '/publications/create',
                element: <PublicationCreatePage />,
            },
            {
                path: '/publications/edit/:id',
                element: <PublicationEditPage />,
            },
            {
                path: '/publications/:id',
                element: <PublicationShowPage />,
            },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);
