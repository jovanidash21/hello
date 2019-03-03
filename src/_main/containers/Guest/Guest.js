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
      gender: 'male',
      nameValid: true,
      errorMessage: ''
    };
  }
  componentWillMount() {
    document.body.className = '';
    document.body.classList.add('guest-login-page');
  }
  componentDidUpdate(prevProps) {
    if ( prevProps.auth.guestLogin.loading && ! this.props.auth.guestLogin.loading && this.props.auth.guestLogin.error ) {
      this.setState({errorMessage: this.props.auth.guestLogin.message});
    }
  }
  onInputChange(event) {
    event.preventDefault();

    this.setState({[event.target.name]: event.target.value});
  }
  handleGuestLoginValidation(event) {
    event.preventDefault();

    const { name } = this.state;
    var nameValid = true;
    var errorMessage = '';

    if ( name.trim().length === 0 ) {
      nameValid = false;
    }

    if ( ! nameValid ) {
      errorMessage = 'Name is required';
    }

    this.setState({
      nameValid: nameValid,
      errorMessage: errorMessage
    });

    if ( nameValid && errorMessage.length === 0 ) {
      ::this.handleGuestLogin();
    }
  }
  handleGuestLogin() {
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
      gender,
      nameValid,
      errorMessage
    } = this.state;

    return (
      <Panel className="form-card">
        <Row>
          <Col md="12">
            <h1 className="mui--text-center">Create Identity</h1>
          </Col>
          {
            errorMessage.length > 0 &&
            <Col md="12">
              <Alert label={errorMessage} center />
            </Col>
          }
          <Col md="12">
            <Form onSubmit={::this.handleGuestLoginValidation}>
              <Input
                value={name}
                label="Name"
                name="name"
                onChange={::this.onInputChange}
                disabled={auth.guestLogin.loading}
                invalid={!nameValid}
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
