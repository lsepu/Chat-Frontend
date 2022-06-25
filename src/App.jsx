import "./App.css";
import Contacts from "./pages/Contacts";
import Register from "./pages/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./App.css";
import { useSelector } from "react-redux";

function App() {
  const {user} = useSelector((state) => state.logged)
  return (
    <div className="App">
      <BrowserRouter>
    {user!==null?
      (<p></p>
      ):
      <Navbar bg="ligth" expand="lg">
      <Container>
        <Navbar.Brand href="">Don Raul’s Hardware store</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="SignIn">Sign in</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      }
      <Routes>
        <Route path="SignIn" element={<Register />}/>
        <Route path="welcome" element={<Contacts />}/>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
