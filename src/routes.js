import React from 'react';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import Notfoundpage from './pages/Notfoundpage';

const routes = [
    {
        path: '/auth/login',
        element: <LoginPage /> // Ok
    },
    {
        path: '/auth/register',
        element: <RegisterPage /> // Ok
    },
    // {
    //     path: '/public-channel',
    //     element: <ChatPage /> // Ok
    // },
    {
        path: '/direct-message/:to_id',
        element: <ChatPage /> // Ok
    },
    {
        path: '*',
        element: <Notfoundpage />
    },
]

export default routes;