import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Image, Button, Spinner } from 'react-bootstrap';
import { FaHeart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../../../contexts/AuthContext';
import { getFavoriteMovies } from '../../../services/userService';
import CardCommon from '../../../components/CardMovie/CardCommon';
import PaginationCommon from '../../../components/Pagination/PaginationCommon';
import '../ProfilePage/ProfilePage.css';

const FavoritePage = () => {
  const { user, logout } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getFavoriteMovies(page - 1, 10)
      .then(res => {
        setFavorites(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => {
        setFavorites([]);
        setTotalPages(1);
        setLoading(false);
      });
  }, [page]);

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div className="profile-page-wrapper">
      <Container fluid="lg" className="profile-page-container">
        <Row>
          {/* Sidebar */}
          <Col md={4} lg={3}>
            <aside className="profile-sidebar">
              <h4 className="mb-4">Quản lý tài khoản</h4>
              <Nav className="flex-column profile-nav flex-grow-1">
                <Nav.Link href="/user/favorites" active className="d-flex align-items-center">
                  <FaHeart className="me-3" /> Yêu thích
                </Nav.Link>
                <Nav.Link href="/user/profile" className="d-flex align-items-center">
                  <FaUser className="me-3" /> Tài khoản
                </Nav.Link>
              </Nav>
              <div className="sidebar-user-info text-center">
                <Image src={user.avatarUrl || '/default-avatar.jpg'} roundedCircle width="60" height="60" className="mb-2" />
                <div className="fw-bold">{user.name || user.username}</div>
                <div className="text-secondary small mb-3">{user.email}</div>
                <Nav.Link onClick={logout} className="d-flex align-items-center justify-content-center sidebar-logout-link">
                  <FaSignOutAlt className="me-2" /> Thoát
                </Nav.Link>
              </div>
            </aside>
          </Col>

          {/* Main Content */}
          <Col md={8} lg={9}>
            <main className="profile-main-content">
              <h2 className="mb-4">Danh sách phim yêu thích</h2>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="warning" />
                </div>
              ) : favorites.length === 0 ? (
                <div className="text-secondary text-center py-5">Bạn chưa có phim yêu thích nào.</div>
              ) : (
                <>
                  <div className="favorite-movie-grid row">
                    {favorites.map((movie) => (
                      <div className="col-6 col-md-4 col-lg-3 mb-4" key={movie.id}>
                        <CardCommon
                          poster={movie.smallBanner || movie.bigBanner || ''}
                          title={movie.title}
                          subtitle={movie.subtitle}
                          id={movie.id}
                          badges={[]}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                    <PaginationCommon page={page} totalPages={totalPages} onPageChange={setPage} />
                  </div>
                </>
              )}
            </main>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FavoritePage; 