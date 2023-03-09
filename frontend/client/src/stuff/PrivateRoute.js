import {React} from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter,Routes, Route,Link, redirect, useNavigate } from 'react-router-dom';
import HomePage from '../components/home/HomePage';

/**
    const PrivateRoutes=(props)=>{
       const {web3} = props;
        const isAuth = localStorage.getItem('jwt') != null;
        const navigate = useNavigate()
        return (
            <Route render={(props)=>{isAuth ? (<HomePage web3={web3}/>):(navigate('/login'))}}></Route>
        )
    }
*/

const PrivateRoutes = () =>{
    if(localStorage.getItem('jwt')==null){

        console.log("akakak");
        return <nav><Link to="/login"></Link></nav>
    }

    console.log(localStorage.getItem('jwt'));
}

export default PrivateRoutes;