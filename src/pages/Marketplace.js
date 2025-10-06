import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const Marketplace = () => {
  useEffect(() => {
    // Open Amazon in a new tab
    window.open('https://www.amazon.in/', '_blank');
  }, []);

  return (
    <div className="virtual-garden">
      <div className="container">
        <div className="page-header">
          <Link to="/" className="btn btn-secondary" style={{marginBottom: '2rem'}}>
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1>Eco Marketplace</h1>
          <p>Opening Amazon in a new tab...</p>
        </div>

        <div style={{textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-light)'}}>
          <ExternalLink size={64} style={{marginBottom: '1rem', opacity: 0.5}} />
          <h3>Amazon Marketplace</h3>
          <p>We're opening Amazon in a new tab where you can shop for gardening supplies.</p>
          <p style={{marginTop: '1rem', fontSize: '0.9rem'}}>
            If the new tab didn't open, <a href="https://www.amazon.in/" target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary-green)'}}>click here</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;