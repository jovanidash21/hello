import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'muicss/lib/react/container';
import {
  Form,
  Row,
  Col,
  Panel,
  Divider
} from 'muicss/react';
import uuidv4 from 'uuid/v4';
import mapDispatchToProps from '../../actions';
import Head from '../../components/Head';
import EmailInput from '../../components/AuthForm/Input/EmailInput';
import NameInput from '../../components/AuthForm/Input/NameInput';
import GenderSelect from '../../components/AuthForm/Select/GenderSelect';
import GuestButton from '../../components/AuthForm/Button/GuestButton';
import LoginButton from '../../components/AuthForm/Button/LoginButton';
import RegisterButton from '../../components/AuthForm/Button/RegisterButton';
import ErrorCard from '../../components/AuthForm/Card/ErrorCard';

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
  onNameChange(event) {
    event.preventDefault();

    this.setState({name: event.target.value});
  }
  onGenderChange(event) {
    event.preventDefault();

    this.setState({gender: event.target.value});
  }
  handleHeadData() {
    const title = 'Chat App | Guest';

    return (
      <Head title={title} />
    )
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

    guestLogin(data);
  }
  render() {
    const { auth } = this.props;
    const { gender } = this.state;

    return (
      <div>
        {::this.handleHeadData()}
        <Panel className="form-card">
          <Row>
            <Col md="12">
              <h1 className="mui--text-center">Create Identity</h1>
            </Col>
            {
              auth.isGuestLoginError &&
              <Col md="12">
                <ErrorCard label="Sorry! Guest name already taken." />
              </Col>
            }
            <Col md="12">
              <Form onSubmit={::this.handleGuestLogin}>
                <NameInput
                  onNameChange={::this.onNameChange}
                  isDisabled={auth.isLoading}
                />
                <GenderSelect
                  defaultGender={gender}
                  onGenderChange={::this.onGenderChange}
                  isDisabled={auth.isLoading}
                />
                <GuestButton
                  type="submit"
                  isDisabled={auth.isLoading}
                />
              </Form>
            </Col>
            <Col md="12">
              <Divider className="line" />
            </Col>
            <Col md="12">
              <LoginButton isDisabled={auth.isLoading} />
            </Col>
            <Col md="12">
              <RegisterButton isDisabled={auth.isLoading} />
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
)(Guest);
