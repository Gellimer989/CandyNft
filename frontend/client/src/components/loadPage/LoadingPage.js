import React from 'react';
import './LoadingPage.css'
import logo from '../../Img/logo-no-background.png';
import {CircleLoader} from 'react-spinners'

function LoadingPage(){
    return(
        <html> 
         <div className='main-container-load'>
        
         <header className='header-load'>

            <img src={logo} id='logo-load' />

        </header>
        <body className='position-loader'>
                <div className='container-circle'>
                    <div className='loader-container'>
                    <CircleLoader size={100} color='rgb(118, 22, 163)'/>
                    </div>
                </div>
        </body>
            
        </div>
    </html>
    )
}

export default LoadingPage
