import React, { useState } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button, Offcanvas, Dropdown } from 'react-bootstrap';
import { FaBars, FaSearch, FaUser } from 'react-icons/fa';
import './Header.css';

const Header = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    return (
        <>
            {/* Navbar for desktop */}
            <Navbar expand="lg" className="bg-dark header d-none d-lg-flex py-2" variant="dark">
                <Container fluid className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center flex-grow-1">
                        <Navbar.Brand href="/" className="d-flex align-items-center me-3">
                            <img src="/logo.png" alt="RoPhim" width="40" className="me-2" />
                            <div className="d-flex flex-column lh-sm">
                                <span className="fw-bold text-white m-0" style={{ fontSize: '1.1rem' }}>RoPhim</span>
                                
                            </div>
                        </Navbar.Brand>

                        <Form className="d-flex me-3 flex-grow-1" style={{ maxWidth: '400px' }}>
                            <FormControl
                                type="search"
                                placeholder="Tìm kiếm phim, diễn viên"
                                className="me-2 search-input"
                                aria-label="Search"
                            />
                            
                        </Form>

                        <Nav className="d-flex align-items-center gap-3 menu-links flex-nowrap">
                            <Nav.Link href="#" className="text-white">Thể loại</Nav.Link>
                            <Nav.Link href="#" className="text-white">Phim Lẻ</Nav.Link>
                            <Nav.Link href="#" className="text-white">Phim Bộ</Nav.Link>
                            <Dropdown className="text-white">
                                <Dropdown.Toggle variant="link" className="text-white">
                                    Quốc gia
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="bg-dark text-white">
                                    <Dropdown.Item href="#">Âu Mỹ</Dropdown.Item>
                                    <Dropdown.Item href="#">Hàn Quốc</Dropdown.Item>
                                    <Dropdown.Item href="#">Trung Quốc</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Nav.Link href="#" className="text-white">Diễn Viên</Nav.Link>
                            
                        </Nav>
                    </div>

                    <div className="ms-3">
                        <Button variant="light" className="rounded-pill">
                            <FaUser className="me-2" />
                            Thành viên
                        </Button>
                    </div>
                </Container>
            </Navbar>

            {/* Navbar for mobile */}
            <Navbar expand={false} className="bg-dark header d-lg-none" variant="dark">
                <Container fluid>
                    <Button variant="link" onClick={() => setShowMenu(true)} className="text-white">
                        <FaBars size={22} />
                    </Button>

                    <Navbar.Brand href="/" className="d-flex align-items-center">
                        <img src="/logo.png" alt="RoPhim" width="30" className="me-2" />
                        <div>
                            <div className="fw-bold">RoPhim</div>
                        </div>
                    </Navbar.Brand>

                    <Button variant="link" onClick={() => setShowSearch(!showSearch)} className="text-white">
                        <FaSearch size={20} />
                    </Button>
                </Container>
            </Navbar>

            {/* Mobile search input */}
            {showSearch && (
                <div className="mobile-search-wrapper d-lg-none">
                    <Form className="d-flex mx-3 flex-grow-1">
                        <FormControl
                            type="search"
                            placeholder="Tìm kiếm phim, diễn viên"
                            className="me-2"
                            aria-label="Search"
                        />
                    </Form>
                </div>
            )}

            {/* Offcanvas menu for mobile */}
            <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="start" className="bg-dark text-white">
                <Offcanvas.Header closeButton closeVariant="white">
                    <Offcanvas.Title>
                        <img src="/logo.png" alt="RoPhim" width="30" className="me-2" />
                        RoPhim
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Button variant="light" className="w-100 mb-3 rounded-pill">
                        <FaUser className="me-2" />
                        Thành viên
                    </Button>

                    <Nav className="flex-column">
                        <Nav.Link href="#">Thể loại</Nav.Link>
                        <Nav.Link href="#">Phim Lẻ</Nav.Link>
                        <Nav.Link href="#">Phim Bộ</Nav.Link>
                        <Dropdown>
                            <Dropdown.Toggle variant="link" className="text-white">Quốc gia
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="bg-dark text-white">
                                <Dropdown.Item href="#">Âu Mỹ</Dropdown.Item>
                                <Dropdown.Item href="#">Hàn Quốc</Dropdown.Item>
                                <Dropdown.Item href="#">Trung Quốc</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Nav.Link href="#">Diễn Viên</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default Header;
