import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import logo from '../../Img/logo-no-background.png';
import dispencer from '../../Img/CandyDispencerSmall.png'
import redCoin from '../../Img/red.png'
import greenCoin from '../../Img/green.png'
import pinkCoin from '../../Img/pink.png'
import silverCoin from '../../Img/silver.png'
import goldCoin from '../../Img/gold.png'
import Card from '../card/Card';
import AuthHandler from '../../handler/AuthHandler';
import SwalFireHandler from '../../handler/SwalFireHandler';
import './HomePage.css'


const HomePage = (props) => {
    const { web3 } = props
    const swf = SwalFireHandler();
    const auth = AuthHandler();
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [nftAttr, setNftAttr] = useState(null);
    const [showPopUp, setShowPopUp] = useState(false);
    const [showTitle, setShowTitle] = useState(false);
    const [showTitle2, setShowTitle2] = useState(false);
    const [showTitle3, setShowTitle3] = useState(false);
    const [showTitle4, setShowTitle4] = useState(false);
    const [showTitle5, setShowTitle5] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null)
    const [value, setValue] = useState(null)
    const [selectedAccount, setSelectedAccount] = useState(null)
    const navigate = useNavigate();

    const handleSelectedImage = (image, value) => {
        setSelectedImage(image);
        setValue(value);
    }

    function nav() {
        navigate('/account')
    }

    const handleSearchButton = () => {
        setShowPopUp(true);
    }

    const handleCloseSearch = () => {
        setShowPopUp(false);
    }

    async function handleClickSend() {
        const toSearch = document.getElementById("input-text").value
        if (hasSpecialChars(toSearch)) {
            swf.swalFireNegative('Input non valido')
            return
        }

        if (users.length == 0) {
            await takeAcc()
        }
        const res = users.find((user) => {
            return user === toSearch
        })
        if (res !== undefined) {
            navigate('/user', { state: { account: toSearch } })
        } else {
            swf.swalFireNegative('Nessun utente trpvato per: ' + toSearch)
        }


    }

    function hasSpecialChars(str) {
        var regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
        return regex.test(str);
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

    async function connetToMetamask() {
        if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
            const contractInstance = await new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            setContract(contractInstance)
        }
    }

    useEffect(() => {
        auth.ensureToken()
        window.addEventListener("load", async() => {
            connetToMetamask();
        })
    })

    if (!web3) {
        return <div > Load < /div>
    }

    return ( <
        html >
        <
        div className = 'main-container' >

        <
        header className = 'header' >
        <
        div className = 'header-control' >
        <
        img src = { logo }
        id = 'logo' / >
        <
        /div> <
        div className = 'position-account-button' >

        <
        button id = 'button-header'
        onClick = { nav } > < FontAwesomeIcon icon = { faUser }
        /> </button >
        <
        button id = 'button-header'
        onClick = { handleSearchButton } > < FontAwesomeIcon icon = { faSearch }
        /> </button > {
            showPopUp && ( <
                div className = 'container-popup' >
                <
                input id = 'input-text'
                type = "text"
                value = { selectedAccount }
                placeholder = "Inserisci l'indirizzo di un utente" / >
                <
                button id = 'button-invia'
                onClick = { handleClickSend } > Invia < /button> <
                /div>
            )
        } <
        /div> <
        /header>

        <
        body id = 'body-background' >
        <
        div className = 'align-content' >

        <
        table className = 'table-control' >
        <
        tr > < td style = {
            { padding: "6px" } } >

        <
        div className = 'div-row' >

        <
        span > 0.1 Eth. < /span>

        <
        img src = { greenCoin }
        onClick = {
            () => handleSelectedImage(greenCoin, 0.1) }
        id = 'img-money'
        onMouseEnter = {
            () => setShowTitle(true) }
        onMouseLeave = {
            () => setShowTitle(false) }
        />

        {
            showTitle && ( <
                div id = 'div-message' >
                <
                div > Common: 70 % < /div> <
                div > Uncommon: 21.5 % < /div> <
                div > Rare: 8 % < /div> <
                div > Epic: 0.5 % < /div> <
                div > Ultra: 0 % < /div> <
                div > Legendary: 0 % < /div>


                <
                /div>
            )
        } <
        /div> <
        /td></tr >
        <
        tr > < td style = {
            { padding: "6px" } } >
        <
        div className = 'div-row' >

        <
        span > 0.2 Eth. < /span>

        <
        img src = { redCoin }
        onClick = {
            () => handleSelectedImage(redCoin, 0.2) }
        id = 'img-money'
        onMouseEnter = {
            () => setShowTitle2(true) }
        onMouseLeave = {
            () => setShowTitle2(false) }
        />

        {
            showTitle2 && ( <
                div id = 'div-message' >
                <
                div > Common: 48 % < /div> <
                div > Uncommon: 30 % < /div> <
                div > Rare: 15 % < /div> <
                div > Epic: 7 % < /div> <
                div > Ultra: 0 % < /div> <
                div > Legendary: 0 % < /div> <
                /div>
            )
        } <
        /div> <
        /td></tr >
        <
        tr > < td style = {
            { padding: "6px" } } >
        <
        div className = 'div-row' >

        <
        span > 0.3 Eth. < /span>

        <
        img src = { pinkCoin }
        onClick = {
            () => handleSelectedImage(pinkCoin, 0.3) }
        id = 'img-money'
        onMouseEnter = {
            () => setShowTitle3(true) }
        onMouseLeave = {
            () => setShowTitle3(false) }
        />

        {
            showTitle3 && ( <
                div id = 'div-message' >
                <
                div > Common: 20 % < /div> <
                div > Uncommon: 38 % < /div> <
                div > Rare: 29 % < /div> <
                div > Epic: 10 % < /div> <
                div > Ultra: 2.4 % < /div> <
                div > Legendary: 0.6 % < /div> <
                /div>
            )
        } <
        /div> <
        /td></tr >
        <
        tr > < td style = {
            { padding: "6px" } } >
        <
        div className = 'div-row' >
        <
        span > 0.4 Eth. < /span>

        <
        img src = { silverCoin }
        onClick = {
            () => handleSelectedImage(silverCoin, 0.4) }
        id = 'img-money'
        onMouseEnter = {
            () => setShowTitle4(true) }
        onMouseLeave = {
            () => setShowTitle4(false) }

        />

        {
            showTitle4 && ( <
                div id = 'div-message' >

                <
                div > Common: 0 % < /div> <
                div > Uncommon: 30 % < /div> <
                div > Rare: 45 % < /div> <
                div > Epic: 27 % < /div> <
                div > Ultra: 6 % < /div> <
                div > Legendary: 2 % < /div> <
                /div>
            )
        } <
        /div> <
        /td></tr >
        <
        tr > < td style = {
            { padding: "6px" } } >
        <
        div className = 'div-row' >

        <
        span > 0.5 Eth. < /span>

        <
        img src = { goldCoin }
        onClick = {
            () => handleSelectedImage(goldCoin, 0.5) }
        id = 'img-money'
        onMouseEnter = {
            () => setShowTitle5(true) }
        onMouseLeave = {
            () => setShowTitle5(false) }
        />

        {
            showTitle5 && ( <
                div id = 'div-message' >

                <
                div > Common: 0 % < /div> <
                div > Uncommon: 10 % < /div> <
                div > Rare: 25 % < /div> <
                div > Epic: 47 % < /div> <
                div > Ultra: 13 % < /div> <
                div > Legendary: 5 % < /div> <
                /div>
            )
        } <
        /div> <
        /td></tr >
        <
        /table> <
        div className = 'container-position' >

        <
        div className = 'content-message-bet' >
        <
        h4 > Puntata: < /h4> <
        div >
        <
        img src = { selectedImage }
        id = 'img-coin' / >
        <
        /div> <
        /div>

        <
        div className = 'div-image-position' >
        <
        img src = { dispencer }
        id = 'img-dispencer' > < /img> <
        div className = 'div-button' >
        <
        button id = 'button-start'
        onClick = { getNFT } > Start < /button> <
        /div>


        <
        /div> <
        Card data = { nftAttr }
        />

        <
        /div>

        <
        /div> <
        /body> <
        /div> <
        /html>
    )

    async function getNFT() {
        if (localStorage.getItem('jwt')) {
            if (value) {

                try {
                    await fetch('http://localhost:3002/nftJson', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('jwt')
                        },
                        body: JSON.stringify({ value, account }),
                    }).then(response => response.json()).then(async data => {
                        await web3.eth.getAccounts(function(error, accounts) {
                            if (error) {
                                console.log(error);
                            } else {
                                const val = web3.utils.toWei(value.toString(), "ether");
                                const uri = data['path'];
                                try {
                                    contract.methods.createToken(uri, account).send({ from: accounts[0], gas: 1000000, value: val }, function(err, result) {
                                        if (error) {
                                            console.log(error);
                                        } else if (result) {
                                            // Transazione firmata con successo
                                            console.log("NFT creato con successo: ", result);
                                            console.log("lollo" + data['content']);
                                            set(data);
                                        } else {
                                            console.log("Transazione fallita");
                                        }
                                    })
                                } catch (error) {
                                    console.log(error);
                                    console.log("Transazione fallita");
                                }

                            }
                        });
                    })
                } catch (error) {
                    swf.swalFireNegative("Qualcosa è andato storto!")
                }
            } else {
                swf.swalFireNegative('Devi selezionare una moneta prima! :)')
            }
        } else {
            swf.swalFireNegative("Utente non autorizzato")
        }
    }

    function set(data) {
        setNftAttr(JSON.parse(data["content"]))
    }
}

export default HomePage