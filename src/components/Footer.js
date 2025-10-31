import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Mail, Github, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <Sprout className="logo-icon" />
              <span>ArogyaVatika</span>
            </div>
            <p className="footer-description">
              Garden of Wellness - Where traditional herbal wisdom meets sustainable practices. 
              Join us in creating a greener, healthier future.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)">
                <Twitter size={20} />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://github.com/Hrishikesh-Gavai/ArogyaVatika.git" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h4>Platform</h4>
              <Link to="/garden">Virtual Garden</Link>
              <Link to="/planner">Garden Planner</Link>
              <Link to="/carbon">Carbon Calculator</Link>
              <Link to="/search">AI Herb Search</Link>
              <Link to="/diy">DIY Zone</Link>
              <Link to="/learn">Microlearning</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/avl">AVL Plant Editor</Link>
              <Link to="/delivery">Delivery Routes</Link>
            </div>
            
            <div className="footer-section">
              <h4>Resources</h4>
              <a href="https://arogya-ecommerce.vercel.app" target="_blank" rel="noopener noreferrer">
                Marketplace
              </a>
              <Link to="/learn">Learning Centre</Link>
              <Link to="/dashboard">Community</Link>
              <a href="https://drive.google.com/drive/folders/1gPL3aQoWDRBuMukKo6yhykzlbz8vZxt6?usp=drive_link" target="_blank" rel="noopener noreferrer">Documentation</a>
            </div>
            
            <div className="footer-section">
              <h4>Company</h4>
              <a href="https://drive.google.com/drive/folders/1gPL3aQoWDRBuMukKo6yhykzlbz8vZxt6?usp=drive_link" target="_blank" rel="noopener noreferrer">About Us</a>
              <a href="https://drive.google.com/drive/folders/1gPL3aQoWDRBuMukKo6yhykzlbz8vZxt6?usp=drive_link" target="_blank" rel="noopener noreferrer">Our Mission</a>
              <a href="https://drive.google.com/drive/folders/1gPL3aQoWDRBuMukKo6yhykzlbz8vZxt6?usp=drive_link" target="_blank" rel="noopener noreferrer">Team</a>
              <a href="https://github.com/Hrishikesh-Gavai/ArogyaVatika.git" target="_blank" rel="noopener noreferrer">
                <Mail size={16} />
                Contact Us
              </a>
              <a href="#">Careers</a>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <a href="https://github.com/Hrishikesh-Gavai/ArogyaVatika.git" target="_blank" rel="noopener noreferrer">
                <Mail size={16} />
                GitHub Issues
              </a>
              <a href="#">Help Centre</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} ArogyaVatika. All rights reserved.</p>
          <p>Made with ❤️ for a sustainable future</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
