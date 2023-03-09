import React, { useState,useEffect} from 'react';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {CONTRACT_ADDRESS, CONTRACT_ABI} from '../../config'
import { useNavigate,useLocation } from 'react-router-dom'
import logo from '../../Img/logo-no-background.png';
import imgProfile from '../../Img/profile.png'
import Card from '../card/Card';
import AuthHandler from '../../handler/AuthHandler';
import LoadingPage from '../loadPage/LoadingPage';
import './ShowAccount.css'
import 'animate.css/animate.min.css'

function ShowAccount(props){
    const {web3} = props;
    const auth = AuthHandler();
    const [account, setAccount] = useState(null);
    const [items, setItems] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [tokenIds,setTokenIds] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    function goBack(){
        navigate('/home')
    }

     useEffect(()=>{
        const account = location.state.account;
        setAccount(account);
            auth.ensureToken()           
            setTimeout(async()=>{
                await loadAccount(account)        
                setLoaded(true)
            },3000)
        
    },[])

    if(!web3){
        navigate('/')
        return 
    }
    
    async function loadAccount(account) {
        if(window.ethereum){
        const contractInstance = await new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        await contractInstance.methods.getTokenIdsByOwner(account).call().then(
            async (result) => {
                setTokenIds(result);
              for (let index = 0; index < result.length; index++) {
                const element = await contractInstance.methods.tokenURI(result[index]).call();      
                const url = 'http://localhost:8080/ipfs/'+ element
                await fetch(url).then(res => res.json()).then(data => {items[index] = data});
              }
            setItems(items)
        }) 
    }
    
    }   

    if(!loaded){
        return (
            <LoadingPage />
        )
    }

    const Itemx = ({ item, index, onCLick }) => (
        <div id='item' onClick={() => onCLick(index)} >
            <Card data={item} />
        </div>
    )

    return (
        <html>
        <div className='main-container-account'>

            <header className='header-account'>
                <div className='header-control'>
                    <img src={logo} id='logo-show-account' />
                </div> 
                <div className='position-account-button'>
                    <button id='button-header' onClick={goBack}> <FontAwesomeIcon icon={faHome} /> </button>
                </div>
            </header>

            <body className='body-container-account'>

                <div className='div-container-account' >
                    <div className='div-account-data'>
                        <div className='div-img-account-container'>
                            <img src={imgProfile} id='img-account'></img>
                            <div className='div-text-position'>
                                <span>{account}</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className='list-position-account'>
                        <div className='list'>
                            {items.map((item, index) => (
                                <Itemx
                                    key={item.id}
                                    item={item}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
            </body>
            <footer>

            </footer>
        </div>
    </html>
    )
}

export default ShowAccount