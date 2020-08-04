import React from 'react'

import logoImg from '../../assets/images/logo.svg'
import langingImg from '../../assets/images/landing.svg'
import studyIcon from '../../assets/images/icons/study.svg'
import giveClassesIcon from '../../assets/images/icons/give-classes.svg'
import purpleHeartIcon from '../../assets/images/icons/purple-heart.svg'

import './styles.css'

const Landing = () => {
    return (
        <div id="page-landing">
            <div id="page-landing-content" className="container">
                <div className="logo-container">
                    <img src={logoImg} alt="Proffy" />
                    <h2>Sua plataforma de estudos online.</h2>
                </div>
            <img src={langingImg} alt="Plataforma de estudos" className="hero-image"/>

            <div className="buttons-container">
                <a href="" className="study">
                    <img src={studyIcon} alt="Estudar" />
                    Estudar
                </a>

                <a href="" className="give-classes">
                    <img src={giveClassesIcon} alt="Estudar" />
                    Dar aulas
                </a>
            </div>

            <span className="total-connections">
                Total de 200 conexoes já realizadas <img src={purpleHeartIcon} alt="Coracao Roxo"/>
            </span>

            </div>
        </div>
    )
}

export default Landing