import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import './FileManager.css';
import fileService from '../../services/fileService';
import { useToast } from '../../contexts/ToastContext';
import Pagination from 'react-bootstrap/Pagination';

const FILE_TYPES = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Ảnh', value: 'images' },
    { label: 'Video', value: 'videos' },
];

function formatSize(size) {
    if (size > 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + ' MB';
    return (size / 1024).toFixed(2) + ' KB';
}

const FileManager = forwardRef(({ files = [], onSelect, selectable = false, showUploadZone = false, multiple = false, onUploadSuccess }, ref) => {
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
    const { showToast } = useToast();
    const [totalPages, setTotalPages] = useState(1);

    const filesPerPage = 16;

    useImperativeHandle(ref, () => {
        return {
            refreshFiles: async () => {
                await fetchFiles();
            }
        }
    });

    // Function to fetch files
    const fetchFiles = async () => {
        try {
            setLoading(true);
            const response = await fileService.searchFiles(search, type === 'all' ? '' : type, page, filesPerPage);
            const mappedFiles = response.content.map(file => ({
                id: file.id,
                name: file.fileName,
                url: file.fileUrl,
                type: file.fileName.toLowerCase().endsWith('.mp4') ? 'video' : 'image',
                size: 0
            }));
            setFileList(mappedFiles);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            showToast('Lỗi tải danh sách file!', 'danger');
            console.error('Error fetching files:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch files when component mounts or search/type changes
    useEffect(() => {
        fetchFiles();
    }, [search, type, page]);

    const pageFiles = fileList;

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
            showToast('Lỗi xóa file!', 'danger');
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
    const handleUploadZoneFile = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setLoading(true);
        try {
            if (multiple) {
                for (let i = 0; i < files.length; i++) {
                    await fileService.uploadFile(files[i]);
                }
            } else {
                await fileService.uploadFile(files[0]);
            }
            await fetchFiles();
            onUploadSuccess?.();
        } catch (error) {
            showToast('Lỗi upload file!', 'danger');
            console.error('Lỗi upload file:', error);
        } finally {
            setLoading(false);
            e.target.value = '';
        }
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
                            <div className="small text-truncate" style={{color: '#333'}} title={file.name}>{file.name}</div>
                            <div className="text-muted small">{formatSize(file.size)}</div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-3">
                <Pagination className="mb-0">
                    <Pagination.Prev
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    />
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Pagination.Item
                            key={i + 1}
                            active={page === i + 1}
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    />
                </Pagination>
            </div>

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
});

export default FileManager;