import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from './routes';
import * as Actions from './store/actions';
import { useDispatch } from 'react-redux';
import GlobalStyles from "./components/GlobalStyles";

function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("token: ", token);
        dispatch(Actions.saveUserToRedux(token));
    }, []);


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
        <GlobalStyles>
            <Router>
                {showContentMenus(routes)}
            </Router>
        </GlobalStyles>
    );
}


export default App;