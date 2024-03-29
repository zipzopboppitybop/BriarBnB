// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useHistory } from "react-router-dom";
//import './ProfuleButton.css'

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const history = useHistory();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const manageSpots = (e) => {
        e.preventDefault();
        history.push("/spots/current");
    }

    const manageReviews = (e) => {
        e.preventDefault();
        history.push("/reviews/current");
    }

    const manageBookings = (e) => {
        e.preventDefault();
        history.push("/bookings/current");
    }

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
        history.push("/")
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
    const extraMargin = "profile-button" + (user ? "" : " extra");

    return (
        <>
            <button className={extraMargin} onClick={openMenu}>
                <i className="fas fa-bars icon fa-2x" />
                <i className="fas fa-user-circle icon fa-2x" />
            </button>
            <ul className={ulClassName} ref={ulRef}>
                {user ? (
                    <>
                        <li>Hello, {user.firstName}</li>
                        <li className="email">{user.email}</li>
                        <li className="menu-item email link black" onClick={manageSpots}>
                            Manage Spots
                        </li>
                        <li className="menu-item email link black" onClick={manageReviews}>
                            Manage Reviews
                        </li>
                        <li className="menu-item email link black" onClick={manageBookings}>
                            Manage Bookings
                        </li>
                        <li className="menu-item" onClick={logout}>Log Out</li>
                    </>
                ) : (
                    <>
                        <OpenModalMenuItem
                            itemText="Log In"
                            onItemClick={closeMenu}
                            modalComponent={<LoginFormModal />}
                        />
                        <OpenModalMenuItem
                            itemText="Sign Up"
                            onItemClick={closeMenu}
                            modalComponent={<SignupFormModal />}
                        />
                    </>
                )}
            </ul>
        </>
    );
}

export default ProfileButton;
