import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Image, Form, Button, Tab, Tabs, Toast, ToastContainer } from 'react-bootstrap';
import { FaHeart, FaUser, FaSignOutAlt, FaPlus, FaHistory } from 'react-icons/fa';
import './ProfilePage.css';
import { AuthContext } from '../../../contexts/AuthContext';
import { changePassword, updateUser } from '../../../services/userService';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [toastInfo, setToastInfo] = useState({ show: false, message: '', type: 'success' });
  // React Hook Form setup cho đổi mật khẩu
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  // React Hook Form cho cập nhật thông tin user
  const { register: registerInfo, handleSubmit: handleSubmitInfo, formState: { errors: errorsInfo }, reset: resetInfo, watch: watchInfo } = useForm({
    defaultValues: {
      email: user?.email,
      name: user?.name || user?.username,
      gender: user?.gender || 'OTHER',
      avatar: user?.avatarUrl || '',
    }
  });
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      resetInfo({
        email: user.email,
        name: user.name || user.username,
        gender: user.gender || 'OTHER',
        avatar: user.avatarUrl || '',
      });
    }
  }, [user]);
  
  if (!user) {
    // Optional: Add a loading spinner or redirect
    return <div>Loading user profile...</div>;
  }

  // Handle password change form submit
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await changePassword(data.oldPassword, data.newPassword);
      setToastInfo({ show: true, message: 'Đổi mật khẩu thành công!', type: 'success' });
      reset();
    } catch {
      setToastInfo({ show: true, message: 'Đổi mật khẩu thất bại!', type: 'danger' });
    }
    setLoading(false);
  };
  const newPasswordValue = watch('newPassword', '');

  // Handle update user info
  const onSubmitInfo = async (data) => {
    setLoadingUpdate(true);
    try {
      await updateUser({
        email: data.email,
        name: data.name,
        gender: data.gender,
        avatar: data.avatar,
      });
      setToastInfo({ show: true, message: 'Cập nhật thông tin thành công!', type: 'success' });
      resetInfo(data);
    } catch {
      setToastInfo({ show: true, message: 'Cập nhật thông tin thất bại!', type: 'danger' });
    }
    setLoadingUpdate(false);
  };

  return (
    <div className="profile-page-wrapper">
      <Container fluid="lg" className="profile-page-container">
        <Row>
          {/* Sidebar */}
          <Col md={4} lg={3}>
            <aside className="profile-sidebar">
              <h4 className="mb-4">Quản lý tài khoản</h4>
              <Nav className="flex-column profile-nav flex-grow-1">
                <Nav.Link onClick={() => navigate('/user/favorites')} className="d-flex align-items-center">
                  <FaHeart className="me-3" /> Yêu thích
                </Nav.Link>
                <Nav.Link href="/user/profile" active className="d-flex align-items-center">
                  <FaUser className="me-3" /> Tài khoản
                </Nav.Link>
              </Nav>
              <div className="sidebar-user-info text-center">
                <Image src={user.avatarUrl || '/default-avatar.jpg'} roundedCircle width="60" height="60" className="mb-2" />
                <div className="fw-bold">{user.name || user.username}</div>
                <div className="text-secondary small mb-3">{user.email}</div>
                <Nav.Link onClick={logout} className="d-flex align-items-center justify-content-center sidebar-logout-link">
                    <FaSignOutAlt className="me-2"/> Thoát
                </Nav.Link>
              </div>
            </aside>
          </Col>

          {/* Main Content */}
          <Col md={8} lg={9}>
            <main className="profile-main-content">
              <Tabs defaultActiveKey="info" id="profile-tabs" className="mb-4">
                <Tab eventKey="info" title="Thông tin tài khoản">
                  <h2 className="mb-2">Tài khoản</h2>
                  <p className="text-secondary mb-5">Cập nhật thông tin tài khoản</p>
                  <Form onSubmit={handleSubmitInfo(onSubmitInfo)}>
                    <Row>
                      <Col lg={8}>
                        <Form.Group as={Row} className="mb-4" controlId="formEmail">
                          <Form.Label column sm={3} className="text-sm-end">Email</Form.Label>
                          <Col sm={9}>
                            <Form.Control type="email" {...registerInfo('email', { required: 'Vui lòng nhập email' })} />
                            {errorsInfo.email && <Form.Text className="text-danger">{errorsInfo.email.message}</Form.Text>}
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-4" controlId="formDisplayName">
                          <Form.Label column sm={3} className="text-sm-end">Tên hiển thị</Form.Label>
                          <Col sm={9}>
                            <Form.Control type="text" {...registerInfo('name', { required: 'Vui lòng nhập tên hiển thị' })} />
                            {errorsInfo.name && <Form.Text className="text-danger">{errorsInfo.name.message}</Form.Text>}
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-4" controlId="formGender">
                          <Form.Label column sm={3} className="text-sm-end">Giới tính</Form.Label>
                          <Col sm={9} className="d-flex align-items-center">
                            <Form.Check type="radio" label="Nam" value="MALE" {...registerInfo('gender')} className="me-4" checked={watchInfo('gender') === 'MALE'} />
                            <Form.Check type="radio" label="Nữ" value="FEMALE" {...registerInfo('gender')} className="me-4" checked={watchInfo('gender') === 'FEMALE'} />
                            <Form.Check type="radio" label="Không xác định" value="OTHER" {...registerInfo('gender')} checked={!watchInfo('gender') || watchInfo('gender') === 'OTHER'} />
                          </Col>
                        </Form.Group>
                        <Row className="mb-4">
                          <Col sm={{ span: 9, offset: 3 }}>
                            <Button variant="warning" type="submit" className="update-btn" disabled={loadingUpdate}>
                              {loadingUpdate ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : null}
                              Cập nhật
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={4} className="d-flex flex-column align-items-center justify-content-start pt-2">
                        <Image src={watchInfo('avatar') || user.avatarUrl || '/default-avatar.jpg'} roundedCircle width="120" height="120" className="mb-3" />
                        <Button variant="link" className="change-avatar-btn" onClick={() => window.open(watchInfo('avatar') || user.avatarUrl || '/default-avatar.jpg', '_blank')}>Xem ảnh đại diện</Button>
                      </Col>
                    </Row>
                  </Form>
                </Tab>
                <Tab eventKey="password" title="Đổi mật khẩu">
                  <h2 className="mb-2">Đổi mật khẩu</h2>
                  <p className="text-secondary mb-5">Vui lòng nhập thông tin để đổi mật khẩu</p>
                  {/* Password change form with react-hook-form */}
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-4" controlId="formOldPassword">
                      <Form.Label>Mật khẩu cũ</Form.Label>
                      <Form.Control type="password" placeholder="Nhập mật khẩu cũ" 
                        {...register('oldPassword', { required: 'Vui lòng nhập mật khẩu cũ', minLength: { value: 6, message: 'Tối thiểu 6 ký tự' } })}
                        isInvalid={!!errors.oldPassword}
                      />
                      {errors.oldPassword && <Form.Text className="text-danger">{errors.oldPassword.message}</Form.Text>}
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="formNewPassword">
                      <Form.Label>Mật khẩu mới</Form.Label>
                      <Form.Control type="password" placeholder="Nhập mật khẩu mới"
                        {...register('newPassword', { required: 'Vui lòng nhập mật khẩu mới', minLength: { value: 6, message: 'Tối thiểu 6 ký tự' } })}
                        isInvalid={!!errors.newPassword}
                      />
                      {errors.newPassword && <Form.Text className="text-danger">{errors.newPassword.message}</Form.Text>}
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="formConfirmNewPassword">
                      <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                      <Form.Control type="password" placeholder="Nhập lại mật khẩu mới"
                        {...register('confirmNewPassword', {
                          required: 'Vui lòng xác nhận mật khẩu mới',
                          validate: value => value === newPasswordValue || 'Mật khẩu xác nhận không khớp'
                        })}
                        isInvalid={!!errors.confirmNewPassword}
                      />
                      {errors.confirmNewPassword && <Form.Text className="text-danger">{errors.confirmNewPassword.message}</Form.Text>}
                    </Form.Group>
                    <Button variant="warning" type="submit" disabled={loading}>
                      {loading ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : null}
                      Đổi mật khẩu
                    </Button>
                  </Form>
                </Tab>
              </Tabs>
              <hr className="my-5" />
            </main>
          </Col>
        </Row>
      </Container>
      {/* Toast notification */}
      <ToastContainer position="top-center" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          onClose={() => setToastInfo({ ...toastInfo, show: false })}
          show={toastInfo.show}
          delay={4000}
          autohide
          bg={toastInfo.type}
        >
          <Toast.Body className="text-white">{toastInfo.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default ProfilePage; 