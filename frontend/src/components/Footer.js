import React from 'react';
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <>
            <div id="contact-container">

<div id="contact-left-container">
    <img id="all-icon" src="./images/all-icon.png" alt="media-img" />
    <h1 id="contact-left-header">İletişim</h1>
    <ul id="item-list">
        <Link className="item-list-link">
            <li className="item">
                <div className="item-icon">
                    <img className="icon" src="./images/wp.png" alt="icon" />
                </div>
                <h3 className="item-text">0(000) 000 00 00</h3>
            </li>
        </Link>
        <Link className="item-list-link"> 
        <li className="item">
            <div className="item-icon">
                <img className="icon" src="./images/mail.png" alt="icon" />
            </div>
            <h3 className="item-text">answerflow@stu.fsm.edu.tr</h3>
        </li>
        </Link>
        <Link className="item-list-link"> 
        <li className="item">
            <div className="item-icon">
                <img className="icon" src="./images/location.png" alt="icon" />
            </div>
            <h3 className="item-text">Sütlüce / İstanbul </h3>
        </li>
        </Link>
    </ul>

    <iframe id="location-fsm" src="https://www.google.com/maps/d/embed?mid=194uO9UMl-NHiWrRmhUPrkEWXAkg&hl=en_US&ehbc=2E312F" title="frame" ></iframe>

</div>

<div id="contact-right-container">
    <img id="media" src="./images/media.png" alt="media-img" />
</div>

</div>
        </>
    )
}

export default Footer