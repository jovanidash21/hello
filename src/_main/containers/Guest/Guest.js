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
import Head from '../../../components/Head';
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
  handleHeadData() {
    const title = 'Chat App | Guest';

    return (
      <Head title={title} />
    )
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
                <Alert label="Sorry! Guest name already taken." center />
              </Col>
            }
            <Col md="12">
              <Form onSubmit={::this.handleGuestLogin}>
                <Input
                  value={name}
                  label="Name"
                  name="name"
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
                <GuestButton isDisabled={auth.isLoading} />
              </Form>
            </Col>
            <Col md="12">
              <Divider className="line" />
            </Col>
            <Col md="12">
              <LoginButton link="/" isDisabled={auth.isLoading} />
            </Col>
            <Col md="12">
              <RegisterButton link="/register" isDisabled={auth.isLoading} />
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
