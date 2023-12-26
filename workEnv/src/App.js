import { Button, Navbar, Container, Nav, Row, Col } from "react-bootstrap";
import './App.css';
import { Route, Routes, useNavigate } from "react-router-dom";
import MsdsCheck from "./component/MsdsCheck";

function App() {
  let navigate = useNavigate();

  return (
    <div className="App">
      <Navbar bg="light" data-bs-theme="light">
                <Container>
                    <Navbar.Brand
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        작업환경측정
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link
                            onClick={() => {
                                navigate("/msdscheck");
                            }}
                        >
                            MSDS
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>


      <Routes>
        <Route path="/msdscheck" element={<MsdsCheck/>}/>
      </Routes>
      
    </div>
  );
}

export default App;
