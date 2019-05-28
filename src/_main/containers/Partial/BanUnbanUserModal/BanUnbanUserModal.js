import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Form,
  Button
} from 'muicss/react';
import mapDispatchToProps from '../../../actions';
import { Modal } from '../../../../components/Modal';
import { Avatar } from '../../../../components/Avatar';
import { Alert } from '../../../../components/Alert';
import { Select } from '../../../../components/Form';
import './styles.scss';

class BanUnbanUserModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      banDuration: 'two_hours',
    };
  }
  componentDidUpdate(prevProps) {
    if (
      ( prevProps.bannedUser.ban.loading && this.props.bannedUser.ban.success ) ||
      ( prevProps.bannedUser.unban.loading && this.props.bannedUser.unban.success )
    ) {
      this.props.onClose();
    }
  }
  onInputChange(event) {
    event.preventDefault();

    this.setState({[event.target.name]: event.target.value});
  }
  handleBanUnbanUser(event) {
    event.preventDefault();

    const {
      user,
      banUser,
      unbanUser,
      selectedUser,
    } = this.props;
    const { banDuration } = this.state;
    const activeUser = user.active;
    const isBanned = selectedUser.ban.data;

    if ( ! isBanned ) {
      banUser( selectedUser._id, banDuration );
    } else {
      unbanUser( selectedUser._id );
    }
  }
  render() {
    const {
      bannedUser,
      open,
      selectedUser,
      onClose,
    } = this.props;
    const { banDuration } = this.state;
    const isBanned = selectedUser.ban.data;

    return (
      <Modal
        className="ban-unban-user-modal"
        open={open}
        onClose={onClose}
      >
        <Form onSubmit={::this.handleBanUnbanUser}>
          <Modal.Header>
            <h3 className="modal-title">{!isBanned ? 'Ban' : 'Unban'} User</h3>
          </Modal.Header>
          <Modal.Body>
            <div className="avatar-wrapper">
              <Avatar
                image={selectedUser.profilePicture}
                size="100px"
                name={selectedUser.name}
                roleChatType={selectedUser.role}
                accountType={selectedUser.accountType}
                badgeBigger
                badgeCloser
              />
            </div>
            <p>
              <span className="user-name mui--text-danger">{selectedUser.name}</span>&nbsp;
              {
                ! isBanned
                  ? 'will be banned for'
                  : 'will be unbanned.'
              }
            </p>
            {
              ! isBanned &&
              <Select
                options={[
                  { value: 'two_hours', label: '2 Hours' },
                  { value: 'two_days', label: '2 Days' },
                  { value: 'one_week', label: '1 Week' },
                  { value: 'one_month', label: '1 Month' },
                  { value: 'three_months', label: '3 Months' },
                  { value: 'lifetime', label: 'Lifetime' },
                ]}
                defaultValue={banDuration}
                name="banDuration"
                onChange={::this.onInputChange}
                disabled={bannedUser.ban.loading || bannedUser.unban.loading}
              />
            }
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="button button-default"
              onClick={onClose}
              disabled={bannedUser.ban.loading || bannedUser.unban.loading}
            >
              Cancel
            </Button>
            <Button
              className="button button-primary"
              type="submit"
              disabled={bannedUser.ban.loading || bannedUser.unban.loading}
            >
              {!isBanned ? 'Ban' : 'Unban'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    bannedUser: state.bannedUser,
  }
}

BanUnbanUserModal.propTypes = {
  open: PropTypes.bool,
  selectedUser: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

BanUnbanUserModal.defaultProps = {
  open: false,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BanUnbanUserModal);
