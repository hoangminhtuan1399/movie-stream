import React from 'react';
import './Footer.css';
import { Container, Row, Col } from 'react-bootstrap';
import {
    FaFacebookF,
    FaTiktok,
    FaYoutube,
    FaTelegramPlane,
    FaInstagram,
    FaTimes,
    FaArrowLeft
} from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <Container fluid className="px-5">
                <Row className="align-items-center mb-4">
                    <Col md={6} className="d-flex align-items-center">
                        <img src="/logo.png" alt="RoPhim Logo" className="footer-logo" />
                        <div className="footer-title">
                            <h4>RoPhim</h4>
                            <span>Phim hay cả rổ</span>
                        </div>
                    </Col>
                    <Col md={6} className="footer-social d-flex justify-content-md-end justify-content-start mt-3 mt-md-0">
                        <div className="icon"><FaArrowLeft /></div>
                        <div className="icon"><FaTimes /></div>
                        <div className="icon"><FaFacebookF /></div>
                        <div className="icon"><FaTiktok /></div>
                        <div className="icon"><FaYoutube /></div>
                        <div className="icon"><FaTelegramPlane /></div>
                        <div className="icon"><FaInstagram /></div>
                    </Col>
                </Row>

                <Row className="footer-links mb-2">
                    <Col>
                        <ul className="d-flex flex-wrap gap-3">
                            <li>Hỏi-Đáp</li>
                            <li>Chính sách bảo mật</li>
                            <li>Điều khoản sử dụng</li>
                            <li>Giới thiệu</li>
                            <li>Liên hệ</li>
                        </ul>
                    </Col>
                </Row>

                <Row className="footer-links mb-3">
                    <Col>
                        <ul className="d-flex flex-wrap gap-3">
                            <li className="active">Dongphim</li>
                            <li>Ghienphim</li>
                            <li>Motphim</li>
                            <li>Subnhanh</li>
                        </ul>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <p className="footer-description">
                            RoPhim – Phim hay cả rổ - Trang xem phim online chất lượng cao miễn phí Vietsub, thuyết minh, lồng tiếng full HD.
                            Kho phim mới khổng lồ, phim chiếu rạp, phim bộ, phim lẻ từ nhiều quốc gia như Việt Nam, Hàn Quốc, Trung Quốc,
                            Thái Lan, Nhật Bản, Âu Mỹ... đa dạng thể loại. Khám phá nền tảng phim trực tuyến hay nhất 2024 chất lượng 4K!
                        </p>
                        <p className="footer-copy">© 2024 RoPhim</p>
                    </Col>
                    <Col md={6}></Col> 
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
