import React from 'react';
import SearchBar from './SearchBar';
import NotificationBell from './NotificationBell';
import LogoutButton from './LogoutButton';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-left">
                <SearchBar />
            </div>
            <div className="header-right">
                <NotificationBell />
                <LogoutButton />
            </div>
        </header>
    );
};

export default Header; 