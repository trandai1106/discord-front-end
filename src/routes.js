import React from 'react';
import Register from "./pages/Register";
import Login from './pages/Login';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';

const routes = [
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/chat',
        element: <Chat />
    },
    {
        path: '*',
        element: <NotFound />
    },
]

export default routes;