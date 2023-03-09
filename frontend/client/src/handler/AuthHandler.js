import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwalFireHandler from '../handler/SwalFireHandler';


function AuthHandler() {
  const navigate = useNavigate();
  const swf = SwalFireHandler();

  function logout(){
    localStorage.removeItem('token');
  };

  function setToken(data){
    localStorage.setItem('jwt', data.token);
  }

  function ensureToken(){
    const token = localStorage.getItem('jwt');
        if(!token){
            navigate('/');
        }
  }

  async function checkIdentity(user){
    const token =localStorage.getItem('jwt')
    if (token) {
        try {
          await fetch('http://localhost:3002/check-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify({ user }),
          }).then(response => {
            if(response.ok){
                console.log("ok");
            }else{
                navigate('/')
            }
        })
        }catch(error){
            console.log(error);
            swf.swalFireNegative("Errore durante l' autenticazione dell utente")
            navigate('/')
        }
    }else{
        navigate('/')
    }    
}
return{
    logout,
    checkIdentity,
    ensureToken,
    setToken
}
}
export default AuthHandler