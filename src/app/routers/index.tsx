import { createBrowserRouter } from 'react-router-dom';
import { FeedPage } from '../../pages/feed';
import { SignInPage } from '../../pages/sign-in';
import { ProfilePage } from '../../pages/profile';
import { ArticleEditPage } from '../../pages/article-edit';
import { ArticleReadPage } from '../../pages/article-read';
import { MainLayout } from '../layouts/MainLayout';
import { SignInLayout } from '../layouts/SignInLayout';
import { SignUpPage } from '../../pages/sign-up';
import { NotFoundPage } from '../../pages/not-found';

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
        path: '/',
        element: <SignInLayout />,
        children: [
            {
                path: '/sign-in',
                element: <SignInPage />,
            },
            {
                path: '/sign-up',
                element: <SignUpPage />,
            },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);
