import React, { createContext, useContext, useState } from 'react';

// Create a context with initial state
const PdfsContext = createContext({
  showPdfs: true,
  toggleShowPdfs: () => {},
});

// Create a context provider
export const PdfsProvider = ({ children }) => {
  const [showPdfs, setShowPdfs] = useState(true);

  const toggleShowPdfs = () => {
    setShowPdfs((prevState) => !prevState);
  };

  return (
    <PdfsContext.Provider value={{ showPdfs, toggleShowPdfs }}>
      {children}
    </PdfsContext.Provider>
  );
};

// Create a custom hook to access the context
export const usePdfs = () => {
  return useContext(PdfsContext);
};
