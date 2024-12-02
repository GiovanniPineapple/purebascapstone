import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/styles.css';
import Header from './components/header';
import Carousel from './components/carousel';
import NewsSection from './components/newsection';
import Footer from './components/footer';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './components/approutes';
function App() {
  useEffect(() => {
    
    const bootstrap = require('bootstrap');
    const carouselElement = document.querySelector('#heroCarousel');
    if (carouselElement) {
      new bootstrap.Carousel(carouselElement);
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Header />
        
        <Routes>
          <Route path="/" element={
            <>
              <Carousel />
              <NewsSection />
            </>
          } />
        </Routes>
        
        
        <AppRoutes />
        
        
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
