import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'muicss/lib/react/container';
import {
  Form,
  Row,
  Col,
  Panel,
  Divider
} from 'muicss/react'
import mapDispatchToProps from '../../actions';
import {
  Input,
  Select
} from '../../../components/Form';
import {
  RegisterButton,
  LoginButton,
  GuestButton
} from '../../components/Form';
import { Alert } from '../../../components/Alert';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      name: '',
      username: '',
      gender: 'male',
      password: ''
    };
  }
  componentWillMount() {
    document.body.className = '';
    document.body.classList.add('register-page');
  }
  onInputChange(event) {
    event.preventDefault();

    this.setState({[event.target.name]: event.target.value});
  }
  handleRegister(event) {
    event.preventDefault();

    const { register } = this.props;
    const {
      email,
      name,
      username,
      gender,
      password
    } = this.state;

    register(email, name, username, gender, password);
  }
  render() {
    const { auth } = this.props;
    const {
      email,
      name,
      username,
      gender,
      password
    } = this.state;

    return (
      <div>
        <Panel className="form-card">
          <Row>
            <Col md="12">
              <h1 className="mui--text-center">Create an Account</h1>
            </Col>
            {
              auth.isRegisterError &&
              <Col md="12">
                <Alert label="Sorry! Username already taken." center />
              </Col>
            }
            <Col md="12">
              <Form onSubmit={::this.handleRegister}>
                <Input
                  value={email}
                  label="Email"
                  type="email"
                  name="email"
                  onChange={::this.onInputChange}
                  disabled={auth.isLoading}
                />
                <Input
                  value={name}
                  label="Name"
                  name="name"
                  onChange={::this.onInputChange}
                  disabled={auth.isLoading}
                />
                <Input
                  value={username}
                  label="Username"
                  name="username"
                  onChange={::this.onInputChange}
                  disabled={auth.isLoading}
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
                  disabled={auth.isLoading}
                />
                <Input
                  value={password}
                  label="Password"
                  type="password"
                  name="password"
                  onChange={::this.onInputChange}
                  disabled={auth.isLoading}
                />
                <RegisterButton isDisabled={auth.isLoading} />
              </Form>
            </Col>
            <Col md="12">
              <Divider className="line" />
            </Col>
            <Col md="12">
              <LoginButton link="/" isDisabled={auth.isLoading} />
            </Col>
            <Col md="12">
              <GuestButton link="/guest" isDisabled={auth.isLoading} />
            </Col>
          </Row>
        </Panel>
      </div>
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
)(Register);
