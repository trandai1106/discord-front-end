import React, { useEffect, useState }from "react";
import "./Header.css";
import { useNavigate } from 'react-router-dom'
import authAPI from '../../api/authAPI'

export default function Header(props) {
  const navigate = useNavigate();
  let [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    (async () => {
        let checkUser = await authAPI.getProfile();

        if (checkUser.status != 0) {
          if (checkUser.data.status != 0) {
            userInfo = checkUser.data.data.user;
            setUserInfo(userInfo);
            console.log(userInfo);
          }
          else {
            navigate('/auth/login');
          }
        }
        else {
            navigate('/auth/login');
        }
        // response = await response.json();;
    })()
  }, []);

  const clearToken = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
  }

  return (
    <div className="header">
      <div className="title">Discord</div>
      <div className="user-infor">Name: {userInfo.name} - ID: {userInfo.id}</div>
      <button onClick={clearToken}>Logout</button>
      {/* <button className="login-button">Login</button> */}
    </div>
  );
}
