import React, { createContext, useState } from "react";

export const PageContext = createContext(null);

export const PageProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  return (
    <PageContext.Provider value={{ globalLoading, setGlobalLoading }}>
      {children}
    </PageContext.Provider>
  );
};
