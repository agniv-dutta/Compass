import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="gradient-accent-line" />
      <div className="footer-content">
        <p className="footer-text">
          Smart Buy - AI-Powered Raw Material Price Intelligence
        </p>
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} All rights reserved
        </p>
      </div>
    </footer>
  );
};
