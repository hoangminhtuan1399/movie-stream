import React from 'react';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { HomePage } from '../HomePage/HomePage';



const UserLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <main>{children}</main>
            <HomePage/>
            <Footer />
        </div>
    );
};

export default UserLayout;