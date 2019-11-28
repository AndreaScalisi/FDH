import React from 'react';
import './App.css';
import Home from './components/Home.js'
import About from './components/About.js'
import Paris1884 from './components/Paris1884.js'
import Paris1908 from './components/Paris1908.js'
import Influencer from './components/Influencer.js';

import { BrowserRouter as Router, NavLink, Route} from "react-router-dom";
import { Navbar, Nav, NavDropdown, FormControl} from 'react-bootstrap';

function App() {
  return (
  <div className="App">
      
  <Router>
  <div>
  <Navbar bg="dark" variant="dark" fixed="top" expand="lg">
  <Navbar.Brand as={NavLink} to="/inf">Influencers of the Past</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
    <Nav.Link as={NavLink} to="/">Home</Nav.Link>
      <NavDropdown title="Maps" id="basic-nav-dropdown">
        <NavDropdown.Item as={NavLink} to="/paris1884">Paris 1884</NavDropdown.Item>
        <NavDropdown.Item as={NavLink} to="/paris1908">Paris 1908</NavDropdown.Item>
      </NavDropdown>
      <Nav.Link as={NavLink} to="/about">About</Nav.Link>
      
    </Nav>
  </Navbar.Collapse>
</Navbar>
<div className = "App-body">
  <Route path="/" exact component={Home} />
  <Route path="/paris1884" exact component={Paris1884} />
  <Route path="/paris1908" exact component={Paris1908} />
  <Route path="/about" exact component={About} />
  <Route path="/inf" exact component={Influencer} />
  
    <div className="App-copyright">copyright 2019, Andrea Scalisi and Giacomo Alliata</div>

</div>

</div>
</Router>
      
    </div>

    
  );
}





export default App;
