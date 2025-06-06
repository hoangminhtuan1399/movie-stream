import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button, Container, Nav, Navbar, Offcanvas, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FaBars, FaBoxOpen, FaChartBar, FaFilm, FaSignOutAlt, FaStar, FaUsers } from 'react-icons/fa'
import './AdminLayout.css'
import Cookies from 'js-cookie';

const routerAuth = ['/admin/login'];

const AdminLayout = () => {
  const location = useLocation()
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const path = location.pathname.split('admin/')[1]
    setActiveItem(path || 'movie')
  }, [location])

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/admin/login');
  }

  const navItems = [
    {name: 'Phim', path: 'movie', key: 'movie', icon: <FaFilm className="me-2"/>},
    {name: 'Bộ sưu tập', path: 'collection', key: 'collection', icon: <FaBoxOpen className="me-2"/>},
    {name: 'Diễn viên', path: 'actor', key: 'actor', icon: <FaUsers className="me-2"/>},
    {name: 'Báo cáo', path: 'report', key: 'report', icon: <FaChartBar className="me-2"/>},
  ]

  // Nếu là route auth thì chỉ render nội dung con (login)
  if (routerAuth.includes(location.pathname)) {
    return <Outlet />;
  }

  return (
    <>
      {/* Modal xác nhận đăng xuất */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận đăng xuất</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn đăng xuất?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Navbar cho mobile */}
      <Navbar bg="dark" variant="dark" className="d-lg-none">
        <Container fluid>
          <Navbar.Brand>Admin Panel</Navbar.Brand>
          <Button
            variant="outline-light"
            onClick={() => setShowSidebar(true)}
          >
            <FaBars/>
          </Button>
        </Container>
      </Navbar>
      <div className="d-flex px-0 admin-container">
        {/* Sidebar cho desktop với transition */}
        <div className="d-none d-lg-flex flex-column bg-dark text-white sidebar-desktop"
             style={{width: '300px', minHeight: '100vh'}}>
          <div className="p-3 border-bottom border-secondary">
            <h3 className="m-0">Admin Panel</h3>
          </div>
          <Nav className="flex-column p-3 flex-grow-1">
            {navItems.map((item) => (
              <Nav.Link
                key={item.key}
                as={Link}
                to={item.path}
                active={activeItem === item.key}
                onClick={() => setActiveItem(item.key)}
                className={`mb-1 rounded d-flex align-items-center text-white ${activeItem === item.key ? 'bg-primary' : 'hover-bg-secondary'}`}
              >
                {item.icon}
                {item.name}
              </Nav.Link>
            ))}
          </Nav>
          <div className="p-3 border-top border-secondary">
            <Button
              variant="danger"
              className="w-100 d-flex align-items-center justify-content-center"
              onClick={() => setShowLogoutModal(true)}
            >
              <FaSignOutAlt className="me-2"/>
              Đăng xuất
            </Button>
          </div>
        </div>
        {/* Offcanvas sidebar cho mobile */}
        <Offcanvas
          show={showSidebar}
          onHide={() => setShowSidebar(false)}
          placement="start"
          className="mobile__menu-drawer bg-dark text-white"
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title>Admin Panel</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className={'d-flex flex-column'}>
            <Nav className="flex-column flex-grow-1">
              {navItems.map((item) => (
                <Nav.Link
                  key={item.key}
                  as={Link}
                  to={item.path}
                  active={activeItem === item.key}
                  onClick={() => {
                    setActiveItem(item.key)
                    setShowSidebar(false)
                  }}
                  className={`mb-1 rounded d-flex align-items-center text-white ${activeItem === item.key ? 'bg-primary' : 'hover-bg-secondary'}`}
                >
                  {item.icon}
                  {item.name}
                </Nav.Link>
              ))}
            </Nav>
            <Button
              variant="danger"
              className="w-100 mt-3 d-flex align-items-center justify-content-center"
              onClick={() => setShowLogoutModal(true)}
            >
              <FaSignOutAlt className="me-2"/>
              Đăng xuất
            </Button>
          </Offcanvas.Body>
        </Offcanvas>
        {/* Nội dung chính */}
        <div className="flex-grow-1 p-3 main-content admin-main-content">
          <Outlet/>
        </div>
      </div>
    </>
  )
}

export default AdminLayout
