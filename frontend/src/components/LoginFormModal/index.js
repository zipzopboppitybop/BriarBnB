// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.length > 6) {
            setErrors([]);
            return dispatch(sessionActions.login({ credential, password }))
                .then(closeModal, history.push("/"))
                .catch(
                    async (res) => {
                        const data = await res.json();
                        if (res.status === 403) {
                            return setErrors(['Invalid Credentials'])
                        }
                        if (data && data.errors) setErrors(data.errors);
                    }
                );
        }
        return setErrors(['Password must be longer than 5 characters'])


    };

    const demoUser = (e) => {
        e.preventDefault();
        return dispatch(sessionActions.loginDemo({ credential, password }))
            .then(closeModal, history.push("/"))
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
    }

    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <label>
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Log In</button>
                <button onClick={demoUser}>Demo User</button>
            </form>
        </>
    );
}

export default LoginFormModal;
