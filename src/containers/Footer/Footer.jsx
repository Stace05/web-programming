import React from "react";
import "./Footer.css";
import {FacebookFilled, TwitterCircleFilled, LinkedinFilled} from '@ant-design/icons';
import Logo from "../../components/image/logo.png"

function Footer() {
    return (
        <footer>
            <div className="footer__main">
                <article className="footer__article">
                    <h2>    
                        Some branding stuff
                    </h2>
                   
                </article>
                <img className="logo" src={Logo}/>
                <div className="footer__logos">
                    <FacebookFilled 
                    style={{ fontSize: '200%', marginRight: '10px'}}/>
                    <TwitterCircleFilled
                    style={{ fontSize: '200%', marginRight: '10px'}} />
                    <LinkedinFilled 
                    style={{ fontSize: '200%'}}/>
    </div>
            </div>
            <aside>
                <p>
                    @Copyright all rights are reserved
                </p>
            </aside>
        </footer>
    )
}

export default Footer;