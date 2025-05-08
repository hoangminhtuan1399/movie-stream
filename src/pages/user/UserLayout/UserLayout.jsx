import React from 'react';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { Outlet } from 'react-router-dom';



const UserLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <main>{children}</main>
            <Outlet/>
            <Footer />
        </div>
    );
};

export default UserLayout;