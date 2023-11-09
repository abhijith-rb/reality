import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

 
export default function DeleteConfirmation ({ showModal, confirmModal, hideModal, message })  {
  const FootStyle = {
    display:"flex",
    justifyContent:"space-around",
  }
    return (
        <Modal show={showModal} onHide={hideModal} >
        <Modal.Header closeButton >
          
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body><div className="alert alert-danger">{message}</div></Modal.Body>
        <Modal.Footer style={FootStyle}>
          <Button variant="default" onClick={hideModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => confirmModal() }>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    )
    
}