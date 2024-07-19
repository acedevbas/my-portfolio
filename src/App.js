// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Navbar from './components/NavBar';
import Portfolio from './components/Portfolio';
import DividendCalendar from './components/DividendCalendar';
import Settings from './components/Settings';
import theme from './theme';
import TestComponent from './components/TestComponent';

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/calendar" element={<DividendCalendar />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/test" element={<TestComponent />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;