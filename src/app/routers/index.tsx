import { createBrowserRouter } from 'react-router-dom';
import { FeedPage } from '@pages/feed';
import { ProfilePage } from '@pages/profile';
import { PublicationEditPage } from '@pages/publication-edit';
import { MainLayout } from '../layouts/MainLayout';
import { NotFoundPage } from '@pages/not-found';
import { ConversationsPage } from '@pages/conversations';
import { PublicationShowPage } from '@pages/publication-show';
import { PublicationCreatePage } from '@pages/publication-create';
import { ConversationsShowPage } from '@pages/conversations-show';
import { UserEditPage } from '@pages/user-edit';
import { AdminPage } from '@pages/admin';
import { SettingsPage } from '@pages/settings';

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
                path: '/users/:id/edit',
                element: <UserEditPage />,
            },
            {
                path: '/publications/create',
                element: <PublicationCreatePage />,
            },
            {
                path: '/publications/:id/edit',
                element: <PublicationEditPage />,
            },
            {
                path: '/publications/:id',
                element: <PublicationShowPage />,
            },
            {
                path: '/settings',
                element: <SettingsPage />,
            },
        ],
    },
    {
        path: '/admin/*',
        element: <AdminPage />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);
