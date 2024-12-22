import { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NavbarComponent = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
        const role = localStorage.getItem('role');
        if (role) {
            setUserRole(role);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsAuthenticated(false);
        setUserRole('');
        navigate('/');
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Na pewno chcesz usunąć konto?")) {
          axios
            .delete(`${import.meta.env.VITE_API_URL}/account/delete`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            })
            .then((response) => {
              if (response.status === 200) {
                alert('Konto zostało pomyślnie usunięte.');
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                navigate('/login');
              } else {
                alert(`Wystąpił problem: ${response.status} ${response.statusText}`);
              }
            })
            .catch((error) => {
              if (error.response) {
                if (error.response.status === 400) {
                  alert('Użytkownik ma wypożyczone bądź zarezerwowane książki');
                } else {
                  alert(`Wystąpił błąd: ${error.response.status} ${error.response.statusText}`);
                }
              } else if (error.request) {
                alert('Brak odpowiedzi od serwera. Spróbuj ponownie później.');
              } else {
                alert(`Wystąpił nieoczekiwany błąd: ${error.message}`);
              }
            })
            .finally(() => {
              console.log("Proces usuwania konta zakończony.");
            });
        }
      };

    return (
        <Navbar bg="light" expand="lg" className="mb-3">
            <Navbar.Brand as={Link} to="/">Kasztanowa Biblioteka</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
                <Nav className="me-auto">
                    {isAuthenticated ? (
                        <NavDropdown title="Account" id="accountDropdown">
                            {userRole !== 'Admin' ? (
                                <>
                                    <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/reservations">My Reservations</NavDropdown.Item>
                                    <NavDropdown.Item href="#" className="text-danger" onClick={handleDeleteAccount}>Delete</NavDropdown.Item>
                                </>
                            ) : (
                                <>
                                    <NavDropdown.Item as={Link} to="/books/manage">Manage Books</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/reservations/manage">Manage Reservations</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/rented/manage">Manage Rented</NavDropdown.Item>
                                </>
                            )}
                        </NavDropdown>
                    ) : null}
                </Nav>
                {isAuthenticated && (
                    <Nav className="ms-auto">
                        <Nav.Item>
                            <Nav.Link href="#" className="text-danger" onClick={handleLogout}>Logout</Nav.Link>
                        </Nav.Item>
                    </Nav>
                )}
                {!isAuthenticated && (
                    <Nav className="ms-auto">
                        <Nav.Item>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/register">Register</Nav.Link>
                        </Nav.Item>
                    </Nav>
                )}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavbarComponent;
