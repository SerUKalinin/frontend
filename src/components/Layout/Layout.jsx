import React from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <Sidebar />
            <div className="layout">
                <div className="layout-container">
                    <div className="layout-content">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Layout;
