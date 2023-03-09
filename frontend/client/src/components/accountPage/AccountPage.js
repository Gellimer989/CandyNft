import React, { useState, useEffect } from 'react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config'
import { useNavigate } from 'react-router-dom'
import logo from '../../Img/logo-no-background.png';
import imgProfile from '../../Img/profile.png'
import Card from '../card/Card';
import SwalFireHandler from '../../handler/SwalFireHandler';
import AuthHandler from '../../handler/AuthHandler';
import LoadingPage from '../loadPage/LoadingPage';
import $ from 'jquery'
import 'animate.css/animate.min.css'
import './AccountPage.css'

function AccountPage(props) {
    const { web3 } = props;
    const auth = AuthHandler();
    const swf = SwalFireHandler();
    const [showButton, setShowButton] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showPopUp, setShowPopUp] = useState(false);
    const [value, setValue] = useState('');
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [items, setItems] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [tokenIds, setTokenIds] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        auth.ensureToken()
        setTimeout(async() => {
            await loadAccount()
            setLoaded(true)
        }, 3000)
    }, [])

    if (!web3) {
        navigate('/')
        return
    }

    function nav() {
        window.location.reload(true)
    }

    async function loadAccount() {
        if (window.ethereum) {
            const accounts = await web3.eth.getAccounts();
            auth.checkIdentity(accounts[0]);
            setAccount(accounts[0]);
            const contractInstance = await new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            setContract(contractInstance);
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts[0] !== account) {
                    nav()
                }
            })
            await contractInstance.methods.getTokenIdsByOwner(accounts[0]).call().then(
                async(result) => {
                    setTokenIds(result);
                    for (let index = 0; index < result.length; index++) {
                        const element = await contractInstance.methods.tokenURI(result[index]).call();
                        const url = 'http://localhost:8080/ipfs/' + element
                        await fetch(url).then(res => res.json()).then(data => { items[index] = data });
                    }
                    setItems(items)
                })
        }

    }
    async function trasfer(toAccount, position) {
        auth.ensureToken();
        console.log(position);
        await web3.eth.getAccounts(async function(error, accounts) {
            if (error) {
                console.log(error);
            } else {
                try {
                    const from = account;
                    const to = toAccount;
                    const tokenId = tokenIds[selectedIndex];
                    const gas = await contract.methods.transferFrom(from, to, tokenId).estimateGas({ from });
                    await contract.methods.approve(to, tokenId).send({ from: from, gas: 100000 });
                    contract.methods.transferFrom(from, to, tokenId).send({ from: from, gas: 100000 })
                        .on('transactionHash', (hash) => {
                            console.log("transactionHash: ", hash);
                        })
                        .on('receipt', (receipt) => {
                            swf.swalFirePositive("NFT trasferito con successo!")
                            window.location.reload(false)
                            console.log("receipt: ", receipt);
                        })
                        .on('error', (error) => {
                            swf.swalFireNegative('Qualcosa è andato storto! Impossibile trasferire l NFT')
                            console.log("error: ", error);
                        })

                } catch (error) {
                    console.log(error);
                }
            }
        });
    }

    if (!loaded) {
        return ( <
            LoadingPage / >
        )
    }

    async function takeAcc() {
        await fetch('http://localhost:3002/public-accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ account }),
        }).then(response => response.json()).then(data => {
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                users.push(element['publicAddress']);
            }
        });
    }

    const handleClick = async(item, index) => {
        console.log(index);
        console.log(tokenIds[index]);


        setShowButton(true);
        if (users.length === 0)
            await takeAcc();
        else {
            setSelectedIndex(index)
            setSelectedItem(prevSelectedItem => (prevSelectedItem) === item ? null : item)
        }
    }

    const handleTransferClick = () => {
        setShowPopUp(true);
    }

    function hasSpecialChars(str) {
        var regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
        return regex.test(str);
    }

    const handleClickSend = async() => {
        if (!hasSpecialChars(value) && value != null && value.length == 42) {
            if (users.length == 0) {
                await takeAcc()
            }
            const res = users.find((user) => {
                return user === value
            })
            if (res !== undefined) {
                await trasfer(value, selectedIndex)
            }
        } else {
            swf.swalFireNegative('Perfavore, inserisci un account valido')
            setShowPopUp(false);
        }
    }

    const handleClickBack = async() => {
        setShowPopUp(false);
    }

    const handleInputChange = (e) => {
        setValue(e.target.value);
    }

    const Itemx = ({ item, index, onCLick }) => ( <
        div id = 'item'
        onClick = {
            () => onCLick(index) } >
        <
        Card data = { item }
        /> <
        /div>
    )

    return ( <
        html >
        <
        div className = 'main-container-account' >
        <
        header className = 'header-account' >
        <
        img src = { logo }
        id = 'logo-account' / >
        <
        /header> <
        body className = 'body-container-account' >
        <
        div className = 'div-container-account' >
        <
        div className = 'div-account-data' >
        <
        div className = 'div-img-account-container' >
        <
        img src = { imgProfile }
        id = 'img-account' > < /img> <
        div className = 'div-text-position' >
        <
        span > { account } < /span> <
        /div> <
        div className = 'div-transfer-account' > {
            showButton && < button id = 'transfer-button'
            onClick = { handleTransferClick } > Trasferisci NFT < /button>} {
                showPopUp && ( <
                    div className = 'popup-transfer-container' >
                    <
                    input id = 'input-text'
                    type = "text"
                    value = { value }
                    placeholder = "Inserisci l'indirizzo di destinazione"
                    onChange = { handleInputChange }
                    /> <
                    button id = 'button-send'
                    onClick = { handleClickSend } > Avvia trasferimento < /button> <
                    button id = 'button-back'
                    onClick = { handleClickBack } > Annulla < /button> <
                    /div>
                )
            } <
            /div> <
            /div> <
            /div> <
            /div> <
            div className = 'list-position-account' >
            <
            div className = 'list' > {
                items.map((item, index) => ( <
                    Itemx key = { item.id }
                    item = { item }
                    index = { index }
                    onCLick = {
                        () => { handleClick(item, index) } }
                    />
                ))
            } <
            /div> <
            /div> <
            /body> <
            footer >

            <
            /footer> <
            /div> <
            /html>
        )
    }


    export default AccountPage