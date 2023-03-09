import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';

export const Web3Context = createContext();

function Web3Provider({ children }) {
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        const provider = window.ethereum;
        setWeb3(new Web3(provider));
        await window.ethereum.enable();
      } else if (window.web3) {
        const provider = window.web3.currentProvider;
        setWeb3(new Web3(provider));
      }
    });
  }, []);

  return (
    <Web3Context.Provider value={web3}>
      {children}
    </Web3Context.Provider>
  );
}

export default Web3Provider;