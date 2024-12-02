// src/components/Footer.js
import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-5">
      <div className="container">
        <p>© 2024 Andes K9. Todos los derechos reservados.</p>
        <div className="social-icons">
          <a href="https://www.facebook.com/andesK9" className="text-white mx-3" target="_blank" rel="noopener noreferrer">
            <FaFacebook size={30} />
          </a>
          <a href="https://www.instagram.com/andes_k9/?hl=es" className="text-white mx-3" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={30} />
          </a>
          <a href="https://twitter.com/andesK9" className="text-white mx-3" target="_blank" rel="noopener noreferrer">
            <FaTwitter size={30} />
          </a>
          <a href="https://wa.me/56974466793" className="text-white mx-3" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={30} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
