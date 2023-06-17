import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useDispatch } from 'react-redux';

import * as Actions from './store/actions';
import GlobalStyles from "./components/GlobalStyles/GlobalStyles";
import routes from "./routes";
import store from "./store/store";

function App() {
    const [cookies, setCookies] = useCookies();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = cookies.access_token;
        const id = cookies.id;
        if (!token) {
            console.log("Token not found");
        } else {
            /* 
                Check token on server
            */
            store.dispatch(Actions.saveUserToRedux({ id, token }));
        }
        setIsLoading(false);
    }, []);

    return (
        <GlobalStyles>
            <Router>
                {!isLoading && <Routes>
                    {routes.map((route, index) => {
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