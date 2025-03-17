import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h2>PaperSpace</h2>
            <p>
              A platform dedicated to academic research, publications and
              knowledge sharing.
            </p>
            <div className="contact">
              <span>
                <i className="fas fa-envelope"></i> contact@paperspace.com
              </span>
            </div>
            <div className="socials">
              <a href="#">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          <div className="footer-section links">
            <h2>Quick Links</h2>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/publications">Publications</Link>
              </li>
              {/* <li>
                <Link to="/projects">Projects</Link>
              </li> */}
              <li>
                <Link to="/news">News</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} PaperSpace | All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
