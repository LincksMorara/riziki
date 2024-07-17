// src/components/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './../App.css';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to Riziki POS System</h1>
        <p>Your all-inclusive Point of Sale solution</p>
      </header>
      <main className="landing-main">
        <section className="about-us">
          <h2>About Us</h2>
          <p>
            Riziki POS System is designed to empower small to medium retail businesses by simplifying and streamlining their sales processes. Our comprehensive solution helps you manage your inventory, track sales, monitor expenses, and much more. With Riziki, you can focus on growing your business while we handle the rest. Join the countless businesses that have achieved success with our innovative POS system.
          </p>
        </section>
        <div className="landing-buttons">
          <Link to="/signup" className="landing-button signup">Sign Up</Link>
          <Link to="/login" className="landing-button login">Log In</Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
