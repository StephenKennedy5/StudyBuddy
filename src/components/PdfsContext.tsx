import React, { createContext, ReactNode, useContext, useState } from 'react';

type PdfsContextProps = {
  showPdfs: boolean;
  toggleShowPdfs: () => void;
};

// Create a context with initial state
const PdfsContext = createContext<PdfsContextProps>({
  showPdfs: true,
  toggleShowPdfs: () => {
    console.warn('toggleShowPdfs is not implemented in the context provider');
  },
});

// Create a context provider
export const PdfsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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
export const usePdfs = (): PdfsContextProps => {
  return useContext(PdfsContext);
};
