import React, { useState, useEffect } from 'react';
import './FileManager.css';
import fileService from '../../services/fileService';

const FILE_TYPES = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Ảnh', value: 'images' },
    { label: 'Video', value: 'videos' },
];

function formatSize(size) {
    if (size > 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + ' MB';
    return (size / 1024).toFixed(2) + ' KB';
}

const FileManager = ({ files = [], onSelect, selectable = false, showUploadZone = false, multiple = false }) => {
    const [search, setSearch] = useState('');
    const [type, setType] = useState('all');
    const [showDelete, setShowDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteFile, setDeleteFile] = useState(null);
    const [page, setPage] = useState(1);
    const [fileList, setFileList] = useState(files);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const filesPerPage = 16;

    // Function to fetch files
    const fetchFiles = async () => {
        try {
            setLoading(true);
            const response = await fileService.searchFiles(search, type === 'all' ? '' : type);
            console.log(response);
            const mappedFiles = response.content.map(file => ({
                id: file.id,
                name: file.fileName,
                url: file.fileUrl,
                type: file.fileName.toLowerCase().endsWith('.mp4') ? 'video' : 'image',
                size: 0
            }));
            setFileList(mappedFiles);
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch files when component mounts or search/type changes
    useEffect(() => {
        fetchFiles();
    }, [search, type]);

    const totalPages = Math.ceil(fileList.length / filesPerPage);
    const pageFiles = fileList.slice((page - 1) * filesPerPage, page * filesPerPage);

    const handleDelete = (file) => {
        setDeleteFile(file);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            setDeleting(true);
            await fileService.deleteFile(deleteFile.id);
            setShowModal(false);
            setDeleteFile(null);
            await fetchFiles();
        } catch (error) {
            console.error('Error deleting file:', error);
        } finally {
            setDeleting(false);
        }
    };

    const handleFileSelect = (file) => {
        let newSelected;
        if (multiple) {
            const isSelected = selectedFiles.some(f => f.id === file.id);
        if (isSelected) {
            newSelected = selectedFiles.filter(f => f.id !== file.id);
            } else {
                newSelected = [...selectedFiles, file];
            }
        } else {
            // Chỉ chọn 1 file
            if (selectedFiles.length === 1 && selectedFiles[0].id === file.id) {
                newSelected = [];
            } else {
                newSelected = [file];
        }
        }
        setSelectedFiles(newSelected);
        onSelect?.(newSelected);
    };

    // Drag & drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            // upload logic ở đây nếu cần
        }
    };
    const handleUploadZoneFile = (e) => {
        // const file = e.target.files[0];
        // upload logic ở đây nếu cần
        e.target.value = '';
    };

    return (
        <div className="file-manager">
            {/* Upload Zone */}
            {showUploadZone && (
                <div
                    className={`upload-zone${dragActive ? ' drag-active' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="upload-zone-icon">
                        <i className="bi bi-upload" />
                    </div>
                    <div className="upload-zone-heading">
                        Add media <span className="upload-zone-url">| Add from URL</span>
                    </div>
                    <div className="upload-zone-subtext">Drag and drop images, videos, 3D models, and files</div>
                    <input
                        type="file"
                        accept="image/*,video/*"
                        style={{ display: 'none' }}
                        id="upload-zone-input"
                        onChange={handleUploadZoneFile}
                    />
                    <label htmlFor="upload-zone-input" className="btn btn-outline-primary btn-sm upload-zone-btn">Chọn file</label>
                </div>
            )}
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
            </div>

            {/* Loading indicator */}
            {loading && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
                     style={{ 
                         background: 'rgba(255, 255, 255, 0.7)', 
                         zIndex: 1000,
                         marginTop: '60px'
                     }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {/* File grid */}
            <div className="row g-3 position-relative">
                {pageFiles.map((file, idx) => {
                    // check if file is in selected array
                    const isSelected = selectedFiles.some(f => f.id === file.id);
                    return (
                        <div className="col-6 col-sm-3 col-md-2 col-lg-1" key={file.id || file.name + idx}>
                            <div
                                className={`file-thumb position-relative ${isSelected ? 'selected' : ''}`}
                                onMouseEnter={() => setShowDelete(file)}
                                onMouseLeave={() => setShowDelete(null)}
                                onClick={() => handleFileSelect(file)}
                                style={{ 
                                    cursor: selectable ? 'pointer' : 'default',
                                    border: isSelected ? '2px solid #0d6efd' : '1px solid #dee2e6',
                                    borderRadius: '4px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {file.type === 'video' ? (
                                    <div className="thumb-icon d-flex align-items-center justify-content-center">
                                        <i className="bi bi-camera-video fs-2"></i>
                                    </div>
                                ) : (
                                    <img src={file.url} alt={file.name} className="thumb-img" />
                                )}
                                {showDelete === file && !isSelected && (
                                    <button
                                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(file);
                                        }}
                                        tabIndex={-1}
                                        disabled={deleting}
                                    >
                                        {deleting && deleteFile?.id === file.id ? (
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        ) : (
                                            <i className="bi bi-trash"></i>
                                        )}
                                    </button>
                                )}
                                {isSelected && (
                                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                                         style={{ background: 'rgba(13, 110, 253, 0.1)' }}>
                                        <i className="bi bi-check-circle-fill text-primary fs-4"></i>
                                    </div>
                                )}
                            </div>
                            <div className="small text-truncate" title={file.name}>{file.name}</div>
                            <div className="text-muted small">{formatSize(file.size)}</div>
                        </div>
                    );
                })}
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

            {/* Delete confirm modal */}
            <div className={`modal fade${showModal ? ' show' : ''}`} tabIndex="-1" style={showModal ? { display: 'block', background: 'rgba(0,0,0,0.3)' } : {}} aria-modal={showModal} role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Xác nhận xóa</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)} disabled={deleting}></button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            Bạn có chắc muốn xóa file <b>{deleteFile?.name}</b> không?
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={deleting}>Hủy</button>
                            <button className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
                                {deleting ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm me-2" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        Đang xóa...
                                    </>
                                ) : (
                                    'Xóa'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default FileManager;