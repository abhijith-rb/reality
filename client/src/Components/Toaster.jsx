import React from 'react';
import { Toast } from 'react-bootstrap';

const Toaster = ({ showToast, setShowToast }) => {
  return (
    <Toast show={showToast} onClose={() => setShowToast(false)}>
      <Toast.Header>
        <strong className="mr-auto">Bootstrap Toast</strong>
      </Toast.Header>
      <Toast.Body>This is a Bootstrap toast example.</Toast.Body>
    </Toast>
  )
}

export default Toaster