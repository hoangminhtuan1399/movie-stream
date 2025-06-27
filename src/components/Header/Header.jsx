import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
  Offcanvas,
  Dropdown,
  Spinner,
  Image,
} from "react-bootstrap";
import {
  FaBars,
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBell,
  FaArrowLeft,
} from "react-icons/fa";
import "./Header.css";
import ListItem from "../ListItem/ListItem";
import { genreOptions } from "../../utils/genreOptions";
import { countryOptions } from "../../utils/countryOptions";
import SearchModal from "./SearchModal";
import useDebounce from "../../hooks/useDebounce";
import movieApi from "../../services/movieService";
import AuthUser from "./AuthUser";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ user, logout }) => (
  <Dropdown align="end">
    <Dropdown.Toggle
      as="a"
      role="button"
      variant="link"
      id="dropdown-user"
      className="d-flex align-items-center text-white text-decoration-none p-0"
    >
      <Image
        src={user.avatarUrl || "/default-avatar.jpg"}
        roundedCircle
        width="32"
        height="32"
      />
    </Dropdown.Toggle>
    <Dropdown.Menu variant="dark" className="user-dropdown-menu">
      <Dropdown.Header>
        Chào,
        <br />
        <strong>{user.name || user.username}</strong>
      </Dropdown.Header>
      <Dropdown.Divider />
      <Dropdown.Item href="/user/profile">
        <FaUser className="me-2" /> Tài khoản
      </Dropdown.Item>
      {user.role === "ADMIN" && (
        <Dropdown.Item href="/admin">
          <FaTachometerAlt className="me-2" /> Trang quản trị
        </Dropdown.Item>
      )}
      <Dropdown.Divider />
      <Dropdown.Item onClick={logout}>
        <FaSignOutAlt className="me-2" /> Thoát
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const handleSearch = useCallback(async (value) => {
    if (!value) {
      setFilteredResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await movieApi.getMovies({
        keyword: value,
        page: 0,
        size: 10,
      });
      setFilteredResults(data.data.content || []);
    } catch (error) {
      console.error("Search error:", error);
      setFilteredResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearchValue = useDebounce(searchValue, 400);

  useEffect(() => {
    if (debouncedSearchValue !== undefined) {
      setLoading(true);
      handleSearch(debouncedSearchValue);
    }
  }, [debouncedSearchValue, handleSearch]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar for desktop */}
      <Navbar
        expand="lg"
        className={`header d-none d-xl-flex ${isScrolled ? "scrolled" : ""}`}
        variant="dark"
      >
        <Container
          fluid
          className="d-flex justify-content-between align-items-center"
        >
          <div className="d-flex align-items-center justify-between flex-grow-1">
            <div className="d-flex align-items-center me-3">
              <Navbar.Brand
                href="/"
                className="d-flex align-items-center"
                style={{ padding: "8px 0" }}
              >
                <img
                  src="/logo.svg"
                  alt="RoPhim"
                  width="120"
                  className="me-2"
                />
              </Navbar.Brand>
              <div
                className="position-relative"
                style={{ width: "100%", maxWidth: "400px", marginLeft: "40px" }}
              >
                <Form
                  className="d-flex me-3 flex-grow-1"
                  style={{ maxWidth: "400px" }}
                >
                  <div className="search-input-wrapper position-relative">
                    <FaSearch className="search-icon" />
                    <FormControl
                      type="search"
                      placeholder="Tìm kiếm phim, diễn viên"
                      className="me-2 search-input"
                      aria-label="Search"
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        setShowSearchDropdown(!!e.target.value);
                      }}
                      onFocus={() => setShowSearchDropdown(!!searchValue)}
                      onBlur={() =>
                        setTimeout(() => setShowSearchDropdown(false), 200)
                      }
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
              <ListItem
                title="Thể loại"
                itemsMenu={genreOptions}
                columns={2}
                path="/category?genres="
              />
              <Nav.Link href="/category?type=LE" className="text-white fs-6">
                Phim Lẻ
              </Nav.Link>
              <Nav.Link href="/category?type=BO" className="text-white fs-6">
                Phim Bộ
              </Nav.Link>
              <ListItem
                title="Quốc gia"
                itemsMenu={countryOptions}
                columns={1}
                path="/category?countries="
              />
              <Nav.Link href="/actor" className="text-white fs-6">
                Diễn Viên
              </Nav.Link>
            </Nav>
          </div>

          <div className="ms-3">
            {isAuthenticated && user ? (
              <div className="d-flex align-items-center">
                <Button
                  variant="link"
                  className="text-white me-3 notification-bell"
                >
                  <FaBell size={18} />
                </Button>
                <UserMenu user={user} logout={logout} />
              </div>
            ) : (
              <Button
                variant="light"
                className="rounded-pill"
                onClick={() => setShowAuthModal(true)}
              >
                <FaUser className="me-2" />
                Thành viên
              </Button>
            )}
          </div>
        </Container>
      </Navbar>

      {/* Navbar for mobile */}
      <Navbar
        expand={false}
        className={`header d-xl-none ${isScrolled ? "scrolled" : ""}`}
        variant="dark"
      >
        <Container fluid>
          <Button
            variant="link"
            onClick={() => setShowMenu(true)}
            className="text-white"
          >
            <FaBars size={22} />
          </Button>

          <Navbar.Brand href="/" className="d-flex align-items-center">
            <img src="/logo.svg" alt="RoPhim" width="120" />
          </Navbar.Brand>

          <Button
            variant="link"
            onClick={() => setShowSearch(!showSearch)}
            className="text-white"
          >
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
              onChange={(e) => {
                setSearchValue(e.target.value);
                setShowSearchDropdown(!!e.target.value);
              }}
              onFocus={() => setShowSearchDropdown(!!searchValue)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              autoComplete="off"
            />
            {showSearchDropdown && (
              <div
                className="search-modal-body position-absolute w-100 mt-2"
                style={{ zIndex: 1050, left: 0, top: "100%" }}
              >
                <div
                  className="text-secondary mb-2"
                  style={{ fontSize: "0.95rem" }}
                >
                  Danh sách phim
                </div>
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center py-4">
                    <Spinner
                      animation="border"
                      variant="light"
                      size="sm"
                      className="me-2"
                    />
                    <span className="text-white">Đang tìm kiếm...</span>
                  </div>
                ) : filteredResults.length > 0 ? (
                  <>
                    <div className="search-modal-list">
                      {filteredResults.map((movie) => (
                        <div key={movie.id} className="search-modal-item">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="search-modal-poster"
                          />
                          <div className="search-modal-info">
                            <div className="search-modal-title">
                              {movie.title}
                            </div>
                            <div className="search-modal-subtitle">
                              {movie.originalTitle}
                            </div>
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
                    <Button
                      variant="secondary"
                      className="w-100 mt-3 search-modal-btn"
                    >
                      Toàn bộ kết quả
                    </Button>
                  </>
                ) : (
                  !loading &&
                  searchValue && (
                    <div className="text-secondary text-center py-3">
                      Không tìm thấy kết quả
                    </div>
                  )
                )}
              </div>
            )}
          </Form>
        </div>
      )}

      {/* Offcanvas menu for mobile */}
      <Offcanvas
        show={showMenu}
        onHide={() => setShowMenu(false)}
        placement="start"
        className="bg-black text-white"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>
            <img src="/logo.svg" alt="RoPhim" width="120" />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <ListItem title="Thể loại" itemsMenu={genreOptions} columns={2} />
            <Nav.Link className={"fs-6 ps-3"} href="#">
              Phim Lẻ
            </Nav.Link>
            <Nav.Link className={"fs-6 ps-3"} href="#">
              Phim Bộ
            </Nav.Link>
            <ListItem title="Quốc gia" itemsMenu={countryOptions} columns={1} />
            <Nav.Link className={"fs-6 ps-3"} href="#">
              Diễn Viên
            </Nav.Link>
          </Nav>
          <div className="mt-auto">
            {isAuthenticated && user ? (
              <div className="mt-3">
                <hr className="border-secondary" />
                <div className="d-flex align-items-center mb-3 px-2">
                  <Image
                    src={user.avatarUrl || "/default-avatar.jpg"}
                    roundedCircle
                    width="40"
                    height="40"
                    className="me-3"
                  />
                  <div>
                    <div>Chào,</div>
                    <strong>{user.name || user.username}</strong>
                  </div>
                </div>
                <Nav className="flex-column">
                  <Nav.Link href="/user/profile" className="text-white ps-3">
                    <FaUser className="me-2" /> Tài khoản
                  </Nav.Link>
                  {user.role === "ADMIN" && (
                    <Nav.Link href="/admin" className="text-white ps-3">
                      <FaTachometerAlt className="me-2" /> Trang quản trị
                    </Nav.Link>
                  )}
                  <Nav.Link onClick={logout} className="text-white ps-3">
                    <FaSignOutAlt className="me-2" /> Thoát
                  </Nav.Link>
                </Nav>
              </div>
            ) : (
              <Button
                variant="light"
                className="w-100 mt-3 rounded-pill"
                onClick={() => setShowAuthModal(true)}
              >
                <FaUser className="me-2" />
                Thành viên
              </Button>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {!isAuthenticated && (
        <AuthUser show={showAuthModal} onHide={() => setShowAuthModal(false)} />
      )}
    </>
  );
};

// HeaderBack: header nhỏ với nút back
export const HeaderBack = ({
  title = "",
  className = "",
  marginBottom = true,
  style = {},
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`header-back d-flex align-items-center gap-3 py-2 text-white shadow-sm ${className}`}
      style={{
        minHeight: 56,
        paddingTop: "40px",
        marginBottom: marginBottom ? "60px" : "0px",
        zIndex: 2,
        position: "relative",
        paddingLeft: "40px",
        paddingRight: "40px",
        ...style,
      }}
    >
      <button
        className="btn btn-link text-white p-0 d-flex align-items-center"
        style={{ fontSize: 22 }}
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
      </button>
      <span className="fw-bold fs-5">{title}</span>
    </div>
  );
};

export default Header;
