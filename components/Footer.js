import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function Footer({ path }) {
  return (
    <footer className="my-3">
      <Container>
        <Row>
          <Col sm={4} className="mt-3 mx-auto">
              <hr />
              <p className="text-muted text-center">
                Health Assistant is a school project. Please visit <a href="https://codabool.com">CodaBool.com</a> to view more of my work.
              </p>
              {path === '/track' && 
                <>
                  <p className='text-center'>Licences</p>
                  <p className="text-muted" style={{fontSize: '.8rem'}}>
                    Diet Model by <a href="https://sketchfab.com/Doguigc">guidogc</a>, with a <a href="https://sketchfab.com/3d-models/low-poly-food-eae38a677a614d8a9ac2c081b9197919">CC licence</a>. The model was reduced to only the carrot, apple and avocado
                  </p>
                  <p className="text-muted" style={{fontSize: '.8rem'}}>
                    Exercise Model  by <a href="https://sketchfab.com/kambu_ch">MechanicalOnion</a>, with a <a href="https://sketchfab.com/3d-models/ultra-low-poly-bicycles-set-of-3-fca3293dcac3417ebce7625f5261275c">CC licence</a>. The model was reduced to only 1 bike.
                  </p>
                  <p className="text-muted" style={{fontSize: '.8rem'}}>
                    Weight Model by <a href="https://sketchfab.com/dreamsoftin">Dreamsoft Innovations Private Limited</a>, with a <a href="https://sketchfab.com/3d-models/weighing-scale-366ba4e613004db0bab6c04f0c1ee5a8">CC licence</a>. The model was only optimized.
                  </p>
                </>
              }
          </Col>
        </Row>
        <Row>
          <div className="text-muted">
            <hr/>
          </div>
        </Row>
        <Row className="ms-2">
          <div className="mx-auto" style={{maxWidth: '10rem'}}>
            <a href="https://github.com/codabool" className="me-3">
              <img
                src="/git-logo.jpg"
                alt="github"
                className="rounded-circle"
                width={60}
                height={60}
                />
            </a>
            <a href="https://twitter.com/coda_bool" className="me-3">
              <img
                src="/twitter-logo.jpg"
                alt="twitter"
                className="rounded-circle"
                width={60}
                height={60}
              />
            </a>
          </div>
        </Row>
      </Container>
    </footer>
  )
}
