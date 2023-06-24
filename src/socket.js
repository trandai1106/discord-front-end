import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

const socket = io(URL, {
  'reconnection': true,
  'reconnectionDelay': 500,
  'reconnectionAttempts': 1000
});

if (document.cookie.length > 0) {
  const cookies = document.cookie.split(';');
  const id = cookies.filter(cookie => cookie.includes("id="))[0].split('=')[1];
  const token = cookies.filter(cookie => cookie.includes("access_token="))[0].split('=')[1];

  socket.emit("c_pairID", { id: id, access_token: token });
  console.log("socket connected", id, token);
}

export default socket;