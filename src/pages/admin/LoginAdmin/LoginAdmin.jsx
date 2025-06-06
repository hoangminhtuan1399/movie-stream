import React, { useState } from 'react';
import './LoginAdmin.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { loginService } from '../../../services/loginService';
import Cookies from 'js-cookie';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  username: yup.string().required('Vui lòng nhập tên đăng nhập'),
  password: yup.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').required('Vui lòng nhập mật khẩu'),
});

const LoginAdmin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const res = await loginService.login(data.username, data.password);
      const userData = res.data && res.data.data;
      if (userData && userData.accessToken) {
        Cookies.set('token', userData.accessToken, { expires: 7 });
        if (userData.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(res.data.message || 'Login failed.');
        setShowToast(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
      setShowToast(true);
    }
    setLoading(false);
  };

  return (
    <div className="login-admin-bg d-flex align-items-center justify-content-center min-vh-100">
      <ToastContainer position="top-center" className="mt-4">
        <Toast bg="danger" show={showToast} onClose={() => setShowToast(false)} delay={3500} autohide>
          <Toast.Header>
            <strong className="me-auto">Đăng nhập thất bại</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{error}</Toast.Body>
        </Toast>
      </ToastContainer>
      <div className="login-admin-card p-5 rounded shadow-lg position-relative">
        <div className="text-center mb-4">
          <div className="login-admin-logo mb-2">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="30" cy="30" rx="30" ry="30" fill="#ffe066"/>
              <path d="M15 35C20 20 40 20 45 35C40 30 20 30 15 35Z" fill="#3B3B54"/>
            </svg>
          </div>
          <h2 className="fw-bold" style={{color: 'var(--color-primary)'}}>Admin Login</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mb-3">
            <label htmlFor="adminUsername" className="form-label text-light">Username</label>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  type="text"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  id="adminUsername"
                  placeholder="Nhập tên đăng nhập"
                  {...field}
                />
              )}
            />
            {errors.username && <div className="invalid-feedback d-block">{errors.username.message}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="adminPassword" className="form-label text-light">Password</label>
            <div className="input-group">
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="adminPassword"
                    placeholder="Password"
                    {...field}
                  />
                )}
              />
              <span className="input-group-text bg-white" style={{cursor:'pointer'}} onClick={()=>setShowPassword(v=>!v)}>
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </span>
            </div>
            {errors.password && <div className="invalid-feedback d-block">{errors.password.message}</div>}
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold mt-4" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="#" className="text-light text-decoration-none">Forget My Password</a>
        </div>
        <div className="text-center mt-4 text-secondary small">
          <span>Term of use | Privacy policy</span>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin; 