import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import insertCoin from '../../Img/insertCoin.png'
import './Card.css'

const Card = (props) => {

    if(!props.data){
        return(
            <div style={{width:'200px', height:'200px', paddingLeft:'10%'}}>
                <img src={insertCoin} className='imageInsertCoin' style={{width:'200%',objectFit:'cover'}}></img>
            </div> 
        )
    }
  
    function getColor(param) {
        let color;
    
        if (param === 'Common') {
            color = 'rgb(102, 102, 102)';
        } else if (param === 'Uncommon') {
            color = 'rgb(22, 185, 103)';
        }else if (param === 'Rare') {
            color = 'rgb(21, 44, 220)';
        }else if (param === 'Epic') {
            color = 'rgb(202, 22, 219)';
        }else if (param === 'Ultra') {
            color = 'red';
        }else if (param === 'Legendary') {
            color = 'rgb(194, 165, 0)';
        }
    
        return color;
    }

    return (
        <div className='div-card'>
        <div className='card-container'>
            <div style={{ border: "5px solid " + getColor(props['data']['rarity']) }} className='card'>

            <img src={"http://localhost:8080/ipfs/"+props['data']['image']} id='card-image' />
                <div className='card-content'>
                    <hr />
                    <span id='card-title'> {props['data']['name']}</span>
                    <hr />
                    <span > Rarity:  </span>
                    <span style={{ color: getColor(props['data']['rarity']), textAlign: "center" }}>{props['data']['rarity']}</span>
                    <hr />
                    <span id='card-value'>Value: {props['data']['value']}<FontAwesomeIcon icon={faEthereum} /> </span>

                    <hr />
                    <p id='card-description'>Description: {props['data']['description']}</p>
                </div>
            </div>
        </div>
    </div>        
    )
}

export default Card