import React from 'react';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import UserScreen from './Screen/UserScreen';
import ChannelMessage from './pages/ChannelMessage/ChannelMessage';
import DirectMessage from './pages/DirectMessage/DirectMessage';
import AllChannels from './pages/AllChannels/AllChannels';
import People from './pages/People/People';
import NotFound from './pages/NotFound/NotFound';

export const publicRoutes = [
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export const privateRoutes = [
  {
    path: '/people',
    element: <UserScreen children={<People />} />,
  },
  {
    path: '/allchannels',
    element: <UserScreen children={<AllChannels />} />,
  },
  {
    path: '/channel-message/:channelId',
    element: <UserScreen children={<ChannelMessage />} />,
  },
  {
    path: '/direct-message/:directId',
    element: <UserScreen children={<DirectMessage />} />,
  },
];

// export default routes;
