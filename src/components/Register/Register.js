import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from './../../store/imgs/logo.png'
import './Register.css'
import authAPI from '../../api/authAPI'
import { useNavigate } from 'react-router-dom'

function Register() {
    const navigate = useNavigate();
    let [registerInformation, setRegisterInformation] = useState({});
    let [registerFalse, setRegisterFalse] = useState(false);
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

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!(registerInformation.name && registerInformation.password && registerInformation.passwordConfirm)) return;
        else {
            registerInformation.role = 'customer';
            registerInformation.name = registerInformation.name;
            // console.log(registerInformation);

            const response = await authAPI.register(registerInformation);
            console.log(response);
            if (response && response.data && response.data.status) {
                // if (registerInformation.role === 'admin') navigate('/admin');
                // else if (registerInformation.role === 'trainer') navigate('/');
                // else navigate('/')
                navigate('/');
            } 
            else if (response && !response.data.status) {
                setRegisterFalse(true);
                setErrorMessage(response.data.message);
            }
        }
    }

    return (
        <div className="register-wrapper">
            {/* Header */}
            {/* <div className="register-header-wrapper"></div> */}

            {/* Header body */}
            <main className="register-body">
                <div className="login-body-wrapper-image">
                    <img  className="img-img-img" src="https://assets-global.website-files.com/5b15d605b7c459fc409872b5/63f00c184058cf9a6f6e865a_629a66f93bec07f4699bc325_hero.png"></img>
                </div>
                <div className="register-body-wrapper">
                    <h2 className="register-body-heading">Register</h2>
                    <div className="register-inner">
                        <form onSubmit={handleRegister}>
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
                                        setRegisterInformation({ ...registerInformation, name });
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
                                        setRegisterInformation({ ...registerInformation, password });
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <div className='input-field-wrapper'>
                                    <b className='input-field-text'>Confirm Password</b>
                                </div>
                                <input
                                    className="user-input"
                                    type="password"
                                    name="password-confirm"
                                    id="password-confirm"
                                    placeholder="Enter passsword again"
                                    onChange={(e) => {
                                        const passwordConfirm = e.target.value;
                                        setRegisterInformation({ ...registerInformation, passwordConfirm });
                                    }}
                                />
                            </div>
                            <div className='error-message-wrapper-register'>
                                {registerFalse && <h2 className="register-false">{errorMessage}</h2>} 
                            </div>
                            <button className={(registerInformation.name && registerInformation.password
                                                && registerInformation.password === registerInformation.passwordConfirm) ? "user-submit-btn-register" : "user-submit-btn-register inactive"}>
                                <b className='submit-btn-text'>Register</b>
                            </button>
                            <div className='register-link-wrapper'>
                                <b className='register-link-text'>You already have an account? Go to <Link to="/auth/login" className='register-link'>Login</Link></b> 
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Register