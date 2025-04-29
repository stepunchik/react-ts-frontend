import { createBrowserRouter } from 'react-router-dom';
import { FeedPage } from '../../pages/feed';
import { ProfilePage } from '../../pages/profile';
import { ArticleEditPage } from '../../pages/article-edit';
import { ArticleReadPage } from '../../pages/article-read';
import { MainLayout } from '../layouts/MainLayout';
import { NotFoundPage } from '../../pages/not-found';
import { ConversationsPage } from '../../pages/conversations';

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
                path: '/profile',
                element: <ProfilePage />,
            },
            {
                path: '/article/edit/:id',
                element: <ArticleEditPage />,
            },
            {
                path: '/article/:id',
                element: <ArticleReadPage />,
            },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);
