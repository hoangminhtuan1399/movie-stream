import React, { useState } from 'react';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { Outlet } from 'react-router-dom';
import { PageContext } from "../../../contexts/PageContext.jsx";
import { LoadingPage } from "../LoadingPage/LoadingPage.jsx";

const UserLayout = () => {
  const [pageLoading, setPageLoading] = useState(false)

  return (
    <PageContext.Provider
      value={{
        pageLoading,
        setPageLoading
      }}
    >
      <LoadingPage pageLoading={pageLoading}/>
      <Header/>
      <main>
        <Outlet/>
      </main>
      <Footer/>
    </PageContext.Provider>
  );
};

export default UserLayout;
