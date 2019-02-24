import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Row,
  Col,
  Panel,
  Divider
} from 'muicss/react';
import uuidv4 from 'uuid/v4';
import mapDispatchToProps from '../../actions';
import {
  Input,
  Select
} from '../../../components/Form';
import {
  GuestButton,
  LoginButton,
  RegisterButton
} from '../../components/Form';
import { Alert } from '../../../components/Alert';

class Guest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      gender: 'male'
    };
  }
  componentWillMount() {
    document.body.className = '';
    document.body.classList.add('guest-login-page');
  }
  onInputChange(event) {
    event.preventDefault();

    this.setState({[event.target.name]: event.target.value});
  }
  handleGuestLogin(event) {
    event.preventDefault();

    const { guestLogin } = this.props;
    const {
      name,
      gender
    } = this.state;
    const username = uuidv4();
    let data = {name, username, gender};

    guestLogin(name, username, gender);
  }
  render() {
    const { auth } = this.props;
    const {
      name,
      gender
    } = this.state;

    return (
      <Panel className="form-card">
        <Row>
          <Col md="12">
            <h1 className="mui--text-center">Create Identity</h1>
          </Col>
          {
            auth.guestLogin.error &&
            <Col md="12">
              <Alert label={auth.guestLogin.message} center />
            </Col>
          }
          <Col md="12">
            <Form onSubmit={::this.handleGuestLogin}>
              <Input
                value={name}
                label="Name"
                name="name"
                onChange={::this.onInputChange}
                disabled={auth.guestLogin.loading}
              />
              <Select
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                ]}
                defaultValue={gender}
                label="Gender"
                name="gender"
                onChange={::this.onInputChange}
                disabled={auth.guestLogin.loading}
              />
              <GuestButton isDisabled={auth.guestLogin.loading} />
            </Form>
          </Col>
          <Col md="12">
            <Divider className="line" />
          </Col>
          <Col md="12">
            <LoginButton link="/" isDisabled={auth.guestLogin.loading} />
          </Col>
          <Col md="12">
            <RegisterButton link="/register" isDisabled={auth.guestLogin.loading} />
          </Col>
        </Row>
      </Panel>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Guest);
