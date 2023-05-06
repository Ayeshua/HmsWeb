import React, { Component } from "react";
import Container from "react-bootstrap/Container";

export class PageNotFound extends Component {
  render() {
    return (
      <Container>
        <h2>404</h2>
        <h1>Page Not Found</h1>
        <p>
          The specified file was not found on this website. Please check the URL
          for mistakes and try again.
        </p>
      </Container>
    );
  }
}

export default PageNotFound;
