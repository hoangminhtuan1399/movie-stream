import { Link, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Button, Container, Nav, Navbar, Offcanvas } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FaBars, FaBoxOpen, FaChartBar, FaFilm, FaSignOutAlt, FaStar, FaUsers } from 'react-icons/fa'
import './AdminLayout.css' // Tạo file CSS mới cho transition
import Footer from '../../../components/Footer/Footer'

const AdminLayout = () => {
  const [activeItem, setActiveItem] = useState('movie')
  const [showSidebar, setShowSidebar] = useState(false)

  const handleLogout = () => {
    console.log('Đăng xuất')
  }

  const navItems = [
    {name: 'Phim', path: 'movie', key: 'movie', icon: <FaFilm className="me-2"/>},
    {name: 'Bộ sưu tập', path: 'collection', key: 'collection', icon: <FaBoxOpen className="me-2"/>},
    {name: 'Nổi bật', path: 'feature', key: 'feature', icon: <FaStar className="me-2"/>},
    {name: 'Diễn viên', path: 'actor', key: 'actor', icon: <FaUsers className="me-2"/>},
    {name: 'Báo cáo', path: 'report', key: 'report', icon: <FaChartBar className="me-2"/>},
  ]

  return (
    <>
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
              onClick={handleLogout}
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
              onClick={handleLogout}
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
      <Footer />
    </>
  )
}

export default AdminLayout
