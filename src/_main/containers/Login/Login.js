import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Row,
  Col,
  Panel,
  Divider
} from 'muicss/react';
import mapDispatchToProps from '../../actions';
import { Input } from '../../../components/Form';
import {
  LoginButton,
  RegisterButton,
  GuestButton,
  SocialButton
} from '../../components/Form';
import { Alert } from '../../../components/Alert';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };
  }
  componentWillMount() {
    document.body.className = '';
    document.body.classList.add('login-page');
  }
  onInputChange(event) {
    event.preventDefault();

    this.setState({[event.target.name]: event.target.value});
  }
  handleLocalLogin(event) {
    event.preventDefault();

    const { localLogin } = this.props;
    const {
      username,
      password
    } = this.state;

    localLogin(username, password);
  }
  render() {
    const {
      facebookLogin,
      googleLogin,
      twitterLogin,
      instagramLogin,
      linkedinLogin,
      githubLogin,
      auth
    } = this.props;
    const {
      username,
      password
    } = this.state;

    return (
      <Panel className="form-card">
        <Row>
          <Col md="12">
            <h1 className="mui--text-center">Chat App</h1>
          </Col>
          {
            auth.login.error &&
            <Col md="12">
              <Alert label={auth.login.message} center />
            </Col>
          }
          <Col md="12">
            <Form onSubmit={::this.handleLocalLogin}>
            <Input
              value={username}
              label="Username"
              name="username"
              onChange={::this.onInputChange}
              disabled={auth.login.loading}
            />
            <Input
              value={password}
              label="Password"
              type="password"
              name="password"
              onChange={::this.onInputChange}
              disabled={auth.login.loading}
            />
              <LoginButton isDisabled={auth.login.loading} />
            </Form>
          </Col>
          <Col md="12">
            <SocialButton
              socialMedia="facebook"
              label="Login with Facebook"
              handleSocialLogin={facebookLogin}
              isDisabled={auth.login.loading}
            />
          </Col>
          <Col md="12">
            <SocialButton
              socialMedia="google"
              label="Login with Google"
              handleSocialLogin={googleLogin}
              isDisabled={auth.login.loading}
            />
          </Col>
          <Col md="12">
            <SocialButton
              socialMedia="twitter"
              label="Login with Twitter"
              handleSocialLogin={twitterLogin}
              isDisabled={auth.login.loading}
            />
          </Col>
          <Col md="12">
            <Divider className="line" />
          </Col>
          <Col md="12">
            <RegisterButton link="/register" isDisabled={auth.login.loading} />
          </Col>
          <Col md="12">
            <GuestButton link="/guest" isDisabled={auth.login.loading} />
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
)(Login);
