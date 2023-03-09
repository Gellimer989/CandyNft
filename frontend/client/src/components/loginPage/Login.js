import {CONTRACT_ADDRESS, CONTRACT_ABI} from '../../config';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import React from 'react';
import logo from '../../Img/logo-no-background.png';
import backgroundImg from "../../Img/CandyDispencer.jpg";
import AuthHandler from '../../handler/AuthHandler';
import '../loginPage/Login.css'


function Login(props){
   const {web3} = props;
   const navigate = useNavigate();
   const [account, setAccount] = useState(null);
   const [contract, setContract] = useState(null);
   const [isConnected, setIsConnected] = useState(false);
   const auth = AuthHandler();

   useEffect(()=>{
        window.addEventListener("load", async () => {  
            connetToMetamask();
        })
    });


    if(!web3){
        return <div>Loading</div>
    }
    
    return (
        <html>
        <div className='main-containerl'>
                <header>
                    <img src={logo} id='logol' />
                </header>
            <body className='bodyl'>
                <div className='containerl'>
                    <div className='div-imagel'>
                        <img src={backgroundImg} id='img-backgroundl' />
                    </div>
                    <div className='div-buttonl'>
                        <button className='buttonl' onClick={getNonce}>
                            <h3>Login with Metamask</h3>
                        </button>
                        <button className='buttonl' onClick={()=>{window.location.href = 'https://metamask.io/download/'}}>
                            <h3> Install Metamask </h3>
                        </button>
                    </div>
                </div>
            </body>
        </div>
    </html>
    )
        async function getNonce() {
            if(window.ethereum.selectedAddress ){
                await fetch(`http://localhost:3002/nonce`, {
                    body: JSON.stringify({ account }),
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    method: 'POST'
                  }).then(response => response.json()).then(async (nonce) => {
                    if(nonce["message"]=="Account not found"){
                        console.log("no nonce")
                        return console.error
                    }
                    await web3.eth.personal.sign(`I am signing my one-time nonce: ${nonce}`,
                      account,
                      (err, signature) => {
                        if (!err){ 
                            console.log(err);
                        fetch(`http://localhost:3002/auth`, {
                          body: JSON.stringify({ account, signature }),
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          method: 'POST'
                        
                        }).then(async response => await response.json())
                          .then((data) => {
                            if(data){
                            setIsConnected(true);
                            localStorage.setItem('jwt', data.token);
                            console.log(isConnected)
                            navigate('/home',{state:{account:account, web3:web3, contract:contract} })
                            }
                          })
                        }
                      }).catch(e => {
                        if (e.code === 4001){
                            return e
                            console.log("reject")
                        } 
                   });
                      
                  })
            }else{
                await connetToMetamask();
            }
        }

    async function connetToMetamask(){
        if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
            const contractInstance = await new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            setContract(contractInstance)
         }else{
            setIsConnected(false);
         }
    }    
}

export default Login