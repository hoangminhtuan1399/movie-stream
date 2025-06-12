import React, { useState, useRef } from 'react';
import './FileManager.css';

const FILE_TYPES = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Ảnh', value: 'image' },
    { label: 'Video', value: 'video' },
];

// Dummy data for demo
const demoFiles = [
    {
        name: 'image_01.png',
        size: 204800,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=thumb&w=200&q=80',
    },
    {
        name: 'image_02.jpg',
        size: 512000,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=thumb&w=200&q=80',
    },
    {
        name: 'image_03.jpg',
        size: 307200,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=thumb&w=200&q=80',
    },
    {
        name: 'image_04.png',
        size: 102400,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=thumb&w=200&q=80',
    },
    {
        name: 'image_05.jpg',
        size: 256000,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=thumb&w=200&q=80',
    },
    {
        name: 'image_06.jpg',
        size: 409600,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=thumb&w=200&q=80',
    },
    {
        name: 'image_07.png',
        size: 350000,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=thumb&w=200&q=80',
    },
    {
        name: 'image_08.jpg',
        size: 180000,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=thumb&w=200&q=80',
    },
    {
        name: 'image_09.jpg',
        size: 220000,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=thumb&w=200&q=80',
    },
    {
        name: 'image_10.png',
        size: 150000,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=thumb&w=200&q=80',
    },
    {
        name: 'video_01.mp4',
        size: 1048576,
        type: 'video',
        url: '', // Use icon only
    },
    {
        name: 'video_02.mov',
        size: 2097152,
        type: 'video',
        url: '',
    },
    {
        name: 'video_03.mp4',
        size: 3145728,
        type: 'video',
        url: '',
    },
    {
        name: 'video_04.avi',
        size: 5242880,
        type: 'video',
        url: '',
    },
];

function formatSize(size) {
    if (size > 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + ' MB';
    return (size / 1024).toFixed(2) + ' KB';
}

const FileManager = ({ files = demoFiles, onSelect, selectable = false }) => {
    const [search, setSearch] = useState('');
    const [type, setType] = useState('all');
    const [showDelete, setShowDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteFile, setDeleteFile] = useState(null);
    const [page, setPage] = useState(1);
    const [fileList, setFileList] = useState(files);
    const fileInputRef = useRef();

    const filesPerPage = 16;
    const filtered = fileList.filter(f => {
        const matchType = type === 'all' || f.type === type;
        const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
    });
    const totalPages = Math.ceil(filtered.length / filesPerPage);
    const pageFiles = filtered.slice((page - 1) * filesPerPage, page * filesPerPage);

    const handleDelete = (file) => {
        setDeleteFile(file);
        setShowModal(true);
    };
    const confirmDelete = () => {
        setFileList(fileList.filter(f => f !== deleteFile));
        setShowModal(false);
        setDeleteFile(null);
    };
    const handleUpload = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map(f => ({
            name: f.name,
            size: f.size,
            type: f.type.startsWith('image') ? 'image' : 'video',
            url: URL.createObjectURL(f),
        }));
        setFileList([...fileList, ...newFiles]);
    };

    return (
        <div className="file-manager">
            {/* Toolbar */}
            <div className="d-flex align-items-center mb-3 gap-2 flex-wrap">
                <input
                    type="text"
                    className="form-control w-auto"
                    placeholder="Tìm kiếm file..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ minWidth: 200 }}
                />
                <select
                    className="form-select w-auto"
                    value={type}
                    onChange={e => setType(e.target.value)}
                >
                    {FILE_TYPES.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => fileInputRef.current.click()}
                >
                    <span className="fs-5">+</span>
                </button>
                <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleUpload}
                />
            </div>
            {/* File grid */}
            <div className="row g-3">
                {pageFiles.map((file, idx) => (
                    <div className="col-6 col-sm-3 col-md-2 col-lg-1" key={file.name + idx}>
                        <div
                            className="file-thumb position-relative"
                            onMouseEnter={() => setShowDelete(file)}
                            onMouseLeave={() => setShowDelete(null)}
                        >
                            {file.type === 'video' ? (
                                <div className="thumb-icon d-flex align-items-center justify-content-center">
                                    <i className="bi bi-camera-video fs-2"></i>
                                </div>
                            ) : (
                                <img src={file.url} alt={file.name} className="thumb-img" />
                            )}
                            {showDelete === file && (
                                <button
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                    onClick={() => handleDelete(file)}
                                    tabIndex={-1}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            )}
                        </div>
                        <div className="small text-truncate" title={file.name}>{file.name}</div>
                        <div className="text-muted small">{formatSize(file.size)}</div>
                    </div>
                ))}
            </div>
            {/* Pagination */}
            <nav className="mt-3">
                <ul className="pagination pagination-sm justify-content-center">
                    <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page - 1)}>&laquo;</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li className={`page-item${page === i + 1 ? ' active' : ''}`} key={i}>
                            <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item${page === totalPages ? ' disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page + 1)}>&raquo;</button>
                    </li>
                </ul>
            </nav>
            {/* Delete confirm modal with Bootstrap animation */}
            <div className={`modal fade${showModal ? ' show' : ''}`} tabIndex="-1" style={showModal ? { display: 'block', background: 'rgba(0,0,0,0.3)' } : {}} aria-modal={showModal} role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Xác nhận xóa</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            Bạn có chắc muốn xóa file <b>{deleteFile?.name}</b> không?
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                            <button className="btn btn-danger" onClick={confirmDelete}>Xóa</button>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default FileManager;