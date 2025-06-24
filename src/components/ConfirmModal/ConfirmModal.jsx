import { Modal, Button, Spinner } from 'react-bootstrap';

const ConfirmModal = ({ show, onHide, onConfirm, title, message, isConfirming }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isConfirming}>
          Không
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isConfirming}>
          {isConfirming ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="ms-2">Đang xử lý...</span>
            </>
          ) : (
            'Xác nhận'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
