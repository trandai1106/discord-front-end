import React from 'react';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Chat from './pages/Chat/Chat';
import NotFound from './pages/NotFound/NotFound';

const routes = [
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/chat',
    element: <Chat />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
