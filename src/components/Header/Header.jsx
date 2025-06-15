import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button, Offcanvas, Dropdown, Spinner, Modal } from 'react-bootstrap';
import { FaBars, FaSearch, FaUser } from 'react-icons/fa';
import './Header.css';
import ListItem from '../ListItem/ListItem';
import { genreOptions } from '../../utils/genreOptions';
import { countryOptions } from '../../utils/countryOptions';
import SearchModal from './SearchModal';
import useDebounce from '../../hooks/useDebounce';
import movieApi from '../../services/movieService';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSearch = useCallback(async (value) => {
    if (!value) {
      setFilteredResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const results = await movieApi.searchMovies(value);
      setFilteredResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setFilteredResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useDebounce(handleSearch, 400);

  useEffect(() => {
    if (searchValue !== undefined) {
      setLoading(true);
      debouncedSearch(searchValue);
    }
  }, [searchValue, debouncedSearch]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Navbar for desktop */}
      <Navbar expand="lg" className={`header d-none d-xl-flex ${isScrolled ? 'scrolled' : ''}`} variant="dark">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center justify-between flex-grow-1">
            <div className="d-flex align-items-center me-3">
              <Navbar.Brand href="/" className='d-flex align-items-center' style={{ padding: '8px 0' }}>
                <img src="/logo.svg" alt="RoPhim" width="120" className="me-2" />
              </Navbar.Brand>
              <div className="position-relative" style={{ width: '100%', maxWidth: '400px', marginLeft: '40px' }}>
                <Form className="d-flex me-3 flex-grow-1" style={{ maxWidth: '400px' }}>
                  <div className="search-input-wrapper position-relative">
                    <FaSearch className="search-icon" />
                    <FormControl
                      type="search"
                      placeholder="Tìm kiếm phim, diễn viên"
                      className="me-2 search-input"
                      aria-label="Search"
                      value={searchValue}
                      onChange={e => {
                        setSearchValue(e.target.value);
                        setShowSearchDropdown(!!e.target.value);
                      }}
                      onFocus={() => setShowSearchDropdown(!!searchValue)}
                      onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                      autoComplete="off"
                    />
                  </div>
                </Form>
                <SearchModal
                  show={showSearchDropdown}
                  onHide={() => setShowSearchDropdown(false)}
                  loading={loading}
                  searchValue={searchValue}
                  filteredResults={filteredResults}
                />
              </div>
            </div>


            <Nav className="d-flex align-items-center gap-3 menu-links flex-nowrap">
              <ListItem title="Thể loại" itemsMenu={genreOptions} columns={2} path="/category" />
              <Nav.Link href="#" className="text-white fs-6">Phim Lẻ</Nav.Link>
              <Nav.Link href="#" className="text-white fs-6">Phim Bộ</Nav.Link>
              <ListItem title="Quốc gia" itemsMenu={countryOptions} columns={1} />
              <Nav.Link href="#" className="text-white fs-6">Diễn Viên</Nav.Link>
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
      <Navbar expand={false} className={`header d-xl-none ${isScrolled ? 'scrolled' : ''}`} variant="dark">
        <Container fluid>
          <Button variant="link" onClick={() => setShowMenu(true)} className="text-white">
            <FaBars size={22} />
          </Button>

          <Navbar.Brand href="/" className="d-flex align-items-center">
            <img src="/logo.svg" alt="RoPhim" width="120" />
          </Navbar.Brand>

          <Button variant="link" onClick={() => setShowSearch(!showSearch)} className="text-white">
            <FaSearch size={20} />
          </Button>
        </Container>
      </Navbar>

      {/* Mobile search input */}
      {showSearch && (
        <div className="mobile-search-wrapper d-lg-none position-relative">
          <Form className="d-flex mx-3 flex-grow-1 position-relative">
            <FormControl
              type="search"
              placeholder="Tìm kiếm phim, diễn viên"
              className="me-2"
              aria-label="Search"
              value={searchValue}
              onChange={e => {
                setSearchValue(e.target.value);
                setShowSearchDropdown(!!e.target.value);
              }}
              onFocus={() => setShowSearchDropdown(!!searchValue)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              autoComplete="off"
            />
            {showSearchDropdown && (
              <div className="search-modal-body position-absolute w-100 mt-2" style={{ zIndex: 1050, left: 0, top: '100%' }}>
                <div className="text-secondary mb-2" style={{ fontSize: '0.95rem' }}>Danh sách phim</div>
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center py-4">
                    <Spinner animation="border" variant="light" size="sm" className="me-2" />
                    <span className="text-white">Đang tìm kiếm...</span>
                  </div>
                ) : filteredResults.length > 0 ? (
                  <>
                    <div className="search-modal-list">
                      {filteredResults.map(movie => (
                        <div key={movie.id} className="search-modal-item">
                          <img src={movie.poster} alt={movie.title} className="search-modal-poster" />
                          <div className="search-modal-info">
                            <div className="search-modal-title">{movie.title}</div>
                            <div className="search-modal-subtitle">{movie.originalTitle}</div>
                            <div className="search-modal-meta">
                              <span>{movie.age}</span>
                              <span>•</span>
                              <span>{movie.year}</span>
                              <span>•</span>
                              <span>{movie.duration}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="secondary" className="w-100 mt-3 search-modal-btn">Toàn bộ kết quả</Button>
                  </>
                ) : (
                  !loading && searchValue && <div className="text-secondary text-center py-3">Không tìm thấy kết quả</div>
                )}
              </div>
            )}
          </Form>
        </div>
      )}

      {/* Offcanvas menu for mobile */}
      <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="start" className="bg-black text-white">
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>
            <img src="/logo.svg" alt="RoPhim" width="120" />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <ListItem title="Thể loại" itemsMenu={genreOptions} columns={2} />
            <Nav.Link className={'fs-6 ps-3'} href="#">Phim Lẻ</Nav.Link>
            <Nav.Link className={'fs-6 ps-3'} href="#">Phim Bộ</Nav.Link>
            <ListItem title="Quốc gia" itemsMenu={countryOptions} columns={1} />
            <Nav.Link className={'fs-6 ps-3'} href="#">Diễn Viên</Nav.Link>
          </Nav>
          <Button variant="light" className="w-100 mt-3 rounded-pill">
            <FaUser className="me-2" />
            Thành viên
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
