import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

const socket = io(URL, {
  autoConnect: true
});

if (document.cookie.length > 0) {
  const cookies = document.cookie.split(';');
  const id = cookies.filter(cookie => cookie.indexOf("id") === 1)[0].split('=')[1];
  const token = cookies.filter(cookie => cookie.indexOf("access_token") === 0)[0].split('=')[1];
  console.log(id, token);

  socket.emit("c_pairID", { id: id, access_token: token });
}

export default socket;