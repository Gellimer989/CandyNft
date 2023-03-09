import './App.css';
import Web3 from 'web3';
import { React, useEffect, useState } from 'react';
import { BrowserRouter,Routes,Route} from 'react-router-dom';
import HomePage from './components/home/HomePage'
import Login from './components/loginPage/Login';
import AccountPage from './components/accountPage/AccountPage';
import ShowAccount from './components/showAccount/ShowAccount';
import SwalFireHandler from './handler/SwalFireHandler';

export default function App() {
  const [web3, setWeb3] = useState(null);
  const swf = SwalFireHandler();

  useEffect(() => {
    //aspettiamo il caricamento della finestra
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      window.ethereum.request({ method: 'eth_requestAccounts' });
      setWeb3(web3);
  }else {
    swf.swalFireNegative("Perfavore installa Metamask!")
  }
    if(!window.ethereum.isConnected()) {
      console.log("disconnected");
    }else{
      console.log("connected")
    }
    //controlliamo se l'utente ha cambiato account o disconnesso 
    const accountWasChanged = (accounts) => {
      if(accounts.length==0){
        console.log("disconnesso");
        localStorage.removeItem('jwt');
      }
      console.log('accountWasChanged');
      localStorage.removeItem('jwt');
      window.location.reload(); 
    }
    const getAndSetAccount = async () => {
      console.log('connect');
    }
    const clearAccount = () => {
      console.log('disconnected');
      localStorage.removeItem('jwt');
    };
    window.ethereum.on('accountsChanged', accountWasChanged);
    window.ethereum.on('connect', getAndSetAccount);
    window.ethereum.on('disconnect', clearAccount);
  },[]);

  
  if(!web3){
    return (
      <div>Loading...</div>
    )
  }

  return(
    <BrowserRouter>
      <Routes>
        <Route index element={<Login web3={web3}/>} />
        <Route path='/home' element={<HomePage web3={web3}/>}/>
        <Route path='/account' element={<AccountPage web3={web3} />} />
        <Route path='/user' element={<ShowAccount web3={web3} toShow={null}/>} />
      </Routes>
    </BrowserRouter> 
  )
}