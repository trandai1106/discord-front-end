import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useCookies } from "react-cookie";

import * as Actions from './store/actions';
import GlobalStyles from "./components/GlobalStyles/GlobalStyles";
import { privateRoutes, publicRoutes } from "./routes";
import store from "./store/store";
import authAPI from "./api/authAPI";

function App() {
    const [cookies,] = useCookies();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = cookies.access_token;
        const id = cookies.id;
        if (!token) {
            console.log("Token not found");
            setIsLoading(false);
        } else {
            authAPI.getProfile(id).then((res) => {
                if (res.status === 1) {
                    store.dispatch(Actions.saveUserToRedux(res.data.user));
                    setIsLoggedIn(true);
                    setIsLoading(false);
                } else {
                    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = 'id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    setIsLoading(false);
                }
            });
        }
    }, []);

    return (
        <GlobalStyles>
            <Router>
                {!isLoading && <Routes>
                    {publicRoutes.map((route, index) => {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={route.element}
                            />
                        )
                    })}
                    {isLoggedIn && privateRoutes.map((route, index) => {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={route.element}
                            />
                        )
                    })}
                </Routes>}
            </Router>
        </GlobalStyles>
    );
}


export default App;