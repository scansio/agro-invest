/* eslint-disable no-unsafe-optional-chaining */

/* eslint-disable no-undef */
import { Link } from "reblend-router";
import imgLight from "../assets/img/illustrations/page-misc-error-light.png";
import Reblend from "reblendjs";
import { Container } from "react-bootstrap";

export default class ErrorWrapper extends Reblend {
  static ELEMENT_NAME = "ErrorWrapper";

  _constructor() {
    super._constructor();
    this.state = {
      hasError: false,
      error: "",
    };
  }

  renderingErrorHandler(error) {
    if (error) {
      this.setState({
        hasError: true,
        error: error.message,
      });
      console.error(error);
      setTimeout(() => (this.state.hasError = false), 100);
    }
  }

  html() {
    return this.state.hasError ? (
      <>
        <Container fluid>
          <div className="misc-wrapper">
            <h2 className="mb-2 mx-2">An Error has Occured</h2>
            <p className="mb-4 mx-2">{this.state.error}</p>
            <Link to="/" className="btn btn-primary">
              Back to home
            </Link>
            <div className="mt-3">
              <img
                src={imgLight}
                alt="Error"
                width="500"
                className="img-fluid"
                data-app-dark-img={imgLight}
                data-app-light-img={imgLight}
              />
            </div>
          </div>
        </Container>
      </>
    ) : (
      this.props.children
    );
  }
}
