import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from './../../store/imgs/logo.png'
import './Login.css'
import authAPI from '../../api/authAPI'
import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate();
    let [loginInformation, setLoginInformation] = useState({});
    let [loginFalse, setLoginFalse] = useState(false);
    let [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
        (async () => {
            let checkUser = await authAPI.getProfile();

            if (checkUser.data.status) {
                navigate('/');
            }
            else {
                // navigate('/auth/login');
            }
            // response = await response.json();;
        })()
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!(loginInformation.name && loginInformation.password)) return;
        else {
            // console.log(loginInformation);
            // loginFalse = true;
            // setLoginFalse(true);
            // setErrorMessage('Error!');
            // Call API
            const response = await authAPI.login(loginInformation);
            console.log(response);
            if (response && response.data && response.data.status) {
                navigate('/my-profile');
            } 
            else if (response && !response.data.status) {
                setLoginFalse(true);
                setErrorMessage(response.data.message);
            }
        }
    }

    return (
        <div className="login-wrapper">
            {/* Header */}
            {/* <div className="login-header-wrapper"></div> */}

            {/* Header body */}
            <main className="login-body">
                <div className="login-body-wrapper-image">
                    <img  className="img-img-img" src="https://assets-global.website-files.com/5b15d605b7c459fc409872b5/63f00c184058cf9a6f6e865a_629a66f93bec07f4699bc325_hero.png"></img>
                </div>
                <div className="login-body-wrapper">
                    <h2 className="login-body-heading">Login</h2>
                    <div className="login-inner">
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <div className='input-field-wrapper'>
                                    <b className='input-field-text'>Username</b>
                                </div>
                                <input
                                    className="user-input"
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Enter username"
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setLoginInformation({ ...loginInformation, name });
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <div className='input-field-wrapper'>
                                    <b className='input-field-text'>Password</b>
                                </div>
                                <input
                                    className="user-input"
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Enter password"
                                    onChange={(e) => {
                                        const password = e.target.value;
                                        setLoginInformation({ ...loginInformation, password });
                                    }}
                                />
                            </div>
                            <div className='error-message-wrapper'>
                                {loginFalse && <h2 className="login-false">{errorMessage}</h2>} 
                            </div>
                            <button className={loginInformation.name && loginInformation.password ? "user-submit-btn-login" : "user-submit-btn-login inactive"}>
                                <b className='submit-btn-text'>Login</b>
                            </button>
                            <div className='register-link-wrapper'>
                                <b className='register-link-text'>Are you a new user? Go to <Link to="/auth/register" className='register-link'>Register</Link></b> 
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Login