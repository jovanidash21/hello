import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Container,
  Row,
  Col
} from 'muicss/react';
import mapDispatchToProps from '../../../actions';
import './styles.scss';

class NotAllowed extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="not-allowed">
        <Container>
          <Row>
            <Col md="12"> 
              Not Allowed
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotAllowed);