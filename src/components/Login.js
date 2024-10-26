import React, { useState } from 'react';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch('/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 403) {
                window.location.href = '/auth/error';
                return Promise.reject('Redirecting to error page');
            } else {
                return response.json().then(data => {
                    throw new Error(data.error || 'Unknown error occurred');
                });
            }
        })
        .then(data => {
            window.location.href = `/auth/dashboard/${data.account_type}`;
        })
        .catch(err => {
            if (err.message !== 'Redirecting to error page') {
                setError(err.message);
            }
        });
    };

    return (
        <div className="container">
            <h2>Log in</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Student Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input type="submit" value="Login" />
            </form>
            <div className="toggle-link">
                <a href="/auth/register">Don't have an account? Sign up here</a>
            </div>
        </div>
    );
};

export default Login;
