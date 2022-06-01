import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default function CustomModal({show, setShow, title, body, action, actionTitle}) {
  return (
    <Modal show={!!show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => setShow(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={action}>{actionTitle}</Button>
      </Modal.Footer>
    </Modal>
  )
}
