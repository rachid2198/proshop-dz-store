import React from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {Navbar,Nav,Container, NavDropdown, Row,Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {logout} from '../features/AuthSlice'
import SearchBox from './SearchBox'
import {profileLogout} from '../features/ProfileSlice'

const Header = () => {
  const {userInfo}= useSelector(store=>store.auth)
  const dispatch=useDispatch()

  const logoutHandler=()=>{
    dispatch(profileLogout())
    dispatch(logout())
  }
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            ProShop
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse as={Row} id="basic-navbar-nav">
            <Nav as={Col} xs={9} className="justify-content-center">
              <SearchBox />
            </Nav>
            <Nav as={Col} xs={4} className="justify-content-end">
              <Nav.Item>
                <Nav.Link as={Link} to="/cart">
                  <i className="fas fa-shopping-cart"></i>Cart
                </Nav.Link>
              </Nav.Item>

              {userInfo ? (
                <Nav.Item>
                  <NavDropdown title={userInfo.name} id="username">
                    <NavDropdown.Item as={Link} to="/profile">
                      {" "}
                      Profile{" "}
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav.Item>
              ) : (
                <Nav.Item>
                  <Nav.Link as={Link} to="/login">
                    <i className="fas fa-user"></i>Login
                  </Nav.Link>
                </Nav.Item>
              )}

              {/* <Nav.Link as={Link} to="/login">
                <i className="fas fa-user"></i>Login
              </Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header