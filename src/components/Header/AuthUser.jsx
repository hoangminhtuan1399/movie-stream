import { useContext, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import './AuthUser.css';
import { loginService } from '../../services/loginService.js';
import Cookies from 'js-cookie';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext';

const AuthUser = ({ show, onHide }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    mode: 'onChange'
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isLoginView) {
        const res = await loginService.login(data.username, data.password);
        const userData = res.data && res.data.data;
        if (userData && userData.accessToken) {
          Cookies.set('token', userData.accessToken, { expires: 7 });
          login(userData);
          onHide();
        } else {
          showToast(res.data.message || 'Đăng nhập thất bại.', 'danger');
        }
      } else {
        const { username, password, name, email } = data;
        const _res = await loginService.register(username, password, email, name);
        showToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
        setIsLoginView(true);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Đã có lỗi xảy ra.';
      showToast(errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchView = () => {
    setIsLoginView(!isLoginView);
    reset();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName="auth-modal-content">
      <Modal.Body className="p-0">
        <div className="d-flex">
          <div className="auth-modal-image-section d-none d-md-block">
            <img src="/rophim-login.jpg" alt="RoPhim" className="mb-2 w-100 h-100 object-fit-cover" />
          </div>
          <div className="auth-modal-form-section p-4 p-sm-5">
            <Modal.Header closeButton className="border-0 p-0 mb-3" />
            <h2 className="mb-3">{isLoginView ? 'Đăng nhập' : 'Đăng ký'}</h2>
            <p className="mb-4 text-white-50">
              {isLoginView ? 'Nếu bạn chưa có tài khoản,' : 'Đã có tài khoản?'}
              <Button variant="link" className="p-0 ms-1" onClick={handleSwitchView}>
                {isLoginView ? 'đăng ký ngay' : 'đăng nhập'}
              </Button>
            </p>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  type="text"
                  {...register("username", { required: "Vui lòng nhập tên đăng nhập." })}
                  isInvalid={!!errors.username}
                  autoComplete="username"
                />
                <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
              </Form.Group>

              {!isLoginView && (
                <>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control
                      type="text"
                      {...register("name", { required: "Vui lòng nhập họ và tên." })}
                      isInvalid={!!errors.name}
                      autoComplete="name"
                    />
                    <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      {...register("email", { required: "Vui lòng nhập email." })}
                      isInvalid={!!errors.email}
                      autoComplete="email"
                    />
                    <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                  </Form.Group>
                </>
              )}

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  {...register("password", {
                    required: "Vui lòng nhập mật khẩu.",
                    minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự." }
                  })}
                  isInvalid={!!errors.password}
                  autoComplete={isLoginView ? "current-password" : "new-password"}
                />
                <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
              </Form.Group>

              {!isLoginView && (
                <Form.Group className="mb-4" controlId="formBasicConfirmPassword">
                  <Form.Label>Xác nhận mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    {...register("confirmPassword", {
                      required: "Vui lòng xác nhận mật khẩu.",
                      validate: value => value === password || "Mật khẩu không khớp."
                    })}
                    isInvalid={!!errors.confirmPassword}
                    autoComplete="new-password"
                  />
                  <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
                </Form.Group>
              )}

              <Button variant="warning" type="submit" className="w-100 fw-bold mt-3" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Đang xử lý...</span>
                  </>
                ) : (
                  isLoginView ? 'Đăng nhập' : 'Đăng ký'
                )}
              </Button>
            </Form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AuthUser; 