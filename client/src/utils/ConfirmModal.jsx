import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'

const ConfirmModal = ({ showModal, confirmModal, hideModal, message, unique }) => {
    
    const FootStyle = {
        display:"flex",
        justifyContent:"space-around",
      }
  return (
        <Modal show={showModal} onHide={hideModal}>
        <Modal.Header closeButton>
          
          <Modal.Title>{unique?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body><div className="alert alert-danger">{message}</div></Modal.Body>
        <Modal.Footer style={FootStyle}>
          <Button variant="default" onClick={hideModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => confirmModal() }>
            {unique?.confirmBtn}
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default ConfirmModal