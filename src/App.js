import React, { useState, useEffect, useRef } from "react";
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import socketIOClient from "socket.io-client";
import './App.css'
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import routes from './routes';
import * as Actions from './store/actions';
import { useDispatch } from 'react-redux';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import Notfoundpage from './pages/Notfoundpage';

// const host = "http://localhost:8080";

// Pages
// const Login = React.lazy(() => import("./views/login/Login"));


// function App() {
//   return (
//   <>
//       <Routes>
//           <Route exact path="/" element={< Notfoundpage />} />
//           <Route path="/auth/login" element={< LoginPage />} />
//           <Route path="/chat" element={<ChatPage />} />
//       </Routes>
//   </>
// )};


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
      const token = localStorage.getItem('token');
      console.log("token: ", token);
      dispatch(Actions.saveUserToRedux(token));
  }, [])


  //Tạo các Route
  const showContentMenus = () => {
      let result = null;
      result = routes.map((route, index) => {
          return (
              <Route
                  key={index}
                  path={route.path}
                  element={route.element}
              />
          )
      })
      return <Routes>{result}</Routes>;
  }

  return (
      <Router>
          {/* <ScrollToTop> */}
              {showContentMenus(routes)}
          {/* </ScrollToTop> */}
      </Router>
  );
}


export default App;