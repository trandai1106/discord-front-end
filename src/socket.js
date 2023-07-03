import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

let socket = io(URL);

try {
  const cookies = document.cookie.split(';');
  const id = cookies.filter(cookie => cookie.includes("id="))[0].split('=')[1];
  const token = cookies.filter(cookie => cookie.includes("access_token="))[0].split('=')[1];

  socket.emit("c_pairID", { id: id, access_token: token });
  console.log("socket connected", id, token);
} catch (err) {
  console.log("Cookies not found");
}

socket.on("disconnect", () => {
  console.log("socket disconnected");

  setTimeout(() => {
    socket = io(URL);
    console.log("re connect");
  }, 5000);
});

export default socket;