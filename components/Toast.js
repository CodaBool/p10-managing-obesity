import Toast from 'react-bootstrap/Toast'

export default function ToastCustom({ show, close, title, msg, error, confetti }) {

  return (
    <Toast onClose={close} show={show} delay={15000} autohide>
      {error ? (
        <Toast.Header>
          <div className="mr-auto">
            <strong>{title}</strong>
          </div>
        </Toast.Header>
      ) : (
        <Toast.Header>
          <div
            className="mr-auto"
            style={{
              backgroundImage: `${confetti && "url('/confetti.gif')"}`,
              width: '100%'
            }}
          >
            <strong>{title}</strong>
          </div>
        </Toast.Header>
      )}
      {error && <Toast.Body><h6 className="text-danger">{msg}</h6></Toast.Body>}
      {!error && <Toast.Body><h5>{msg}</h5></Toast.Body>}
    </Toast>
  )
}
