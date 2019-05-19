import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'muicss/react';
import { Modal } from '../../Modal';
import { SearchFilter } from '../../SearchFilter';
import { Avatar } from '../../Avatar';
import { UnbanAllUsersModal } from './UnbanAllUsersModal';
import './styles.scss';

class BannedUsersListModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bannedUsers: [],
      searchFilter: '',
      unbanAllUsersModalOpen: false,
    }
  }
  componentWillMount() {
    this.props.handleFetchBannedUsers();
  }
  componentDidUpdate(prevProps) {
    if ( prevProps.bannedUserFetch.loading && ! this.props.bannedUserFetch.loading ) {
      ::this.handleBannedUsersListFilter();
    }
  }
  handleBannedUsersListFilter(searchFilter = '') {
    const { bannedUsers } = this.props;
    let allBannedUsers = [...bannedUsers];

    if ( searchFilter.length > 0 ) {
      allBannedUsers = allBannedUsers.filter((bannedUser) => {
        return bannedUser.name.toLowerCase().match(searchFilter.toLowerCase());
      });
    } else {
      allBannedUsers = [...bannedUsers];
    }

    this.setState({bannedUsers: allBannedUsers});
  }
  handleClearSearchFilter() {
    this.setState({searchFilter: ''});
    ::this.handleBannedUsersListFilter();
  }
  onSearchFilterChange(event) {
    const searchFilter = event.target.value;

    this.setState({searchFilter: searchFilter});

    ::this.handleBannedUsersListFilter(searchFilter);
  }
  handleOpenUnbanAllUsersModal(event) {
    event.preventDefault();

    this.setState({unbanAllUsersModalOpen: true});
  }
  handleCloseUnbanAllUsersModal() {
    this.setState({unbanAllUsersModalOpen: false});
  }
  handlebanUnbanUser(event, selectedUser) {
    event.preventDefault();

    const { handlebanUnbanUser } = this.props;

    handlebanUnbanUser(selectedUser);
  }
  render() {
    const {
      bannedUsers: allBannedUsers,
      bannedUserFetch,
      handleUnbanAllUsers,
      bannedUserUnbanAll,
      bannedUserBan,
      bannedUserUnban,
      open,
      onClose,
    } = this.props;
    const {
      bannedUsers,
      searchFilter,
      unbanAllUsersModalOpen,
    } = this.state;
    const loading = bannedUserFetch.loading;
    const disabled = bannedUserBan.loading || bannedUserUnban.loading;

    return (
      <Fragment>
        <Modal
          className="banned-users-list-modal"
          open={open}
          onClose={onClose}
          center={false}
          loading={loading}
        >
          <Modal.Header>
            <h3 className="modal-title">Banned Users</h3>
          </Modal.Header>
          <Modal.Body>
            {
              ( loading || ! loading && allBannedUsers.length > 0 ) &&
              <div className="list-header">
                <SearchFilter
                  value={searchFilter}
                  onChange={::this.onSearchFilterChange}
                  handleClearSearchFilter={::this.handleClearSearchFilter}
                />
                {
                  allBannedUsers.length > 0 &&
                  <Button
                    color="danger"
                    size="small"
                    onClick={::this.handleOpenUnbanAllUsersModal}
                    disabled={disabled}
                  >
                    Unban All
                  </Button>
                }
              </div>
            }
            {
              bannedUsers.length > 0 &&
              bannedUsers.map((bannedUser, i) =>
                <div key={i} className="banned-user">
                  <Avatar
                    image={bannedUser.profilePicture}
                    size="40px"
                    name={bannedUser.name}
                    username={bannedUser.username}
                    roleChatType={bannedUser.role}
                    accountType={bannedUser.accountType}
                    badgeCloser
                  />
                  <div className="user-name">
                    {bannedUser.name}
                  </div>
                  <Button
                    className={"button button-" + (bannedUser.banned ? 'default' : 'primary')}
                    size="small"
                    onClick={(e) => {::this.handlebanUnbanUser(e, bannedUser)}}
                    disabled={disabled}
                  >
                    {bannedUser.banned ? 'Unban' : 'ban'}
                  </Button>
                </div>
              )
            }
            {
              bannedUsers.length === 0 &&
              <div className="no-results">
                No {searchFilter.length > 0 ? 'results found' : 'banned users'}
              </div>
            }
          </Modal.Body>
        </Modal>
        {
          unbanAllUsersModalOpen &&
          <UnbanAllUsersModal
            handleUnbanAllUsers={handleUnbanAllUsers}
            bannedUserUnbanAll={bannedUserUnbanAll}
            open={unbanAllUsersModalOpen}
            onClose={::this.handleCloseUnbanAllUsersModal}
          />
        }
      </Fragment>
    )
  }
}

BannedUsersListModal.propTypes = {
  handleFetchBannedUsers: PropTypes.func.isRequired,
  bannedUsers: PropTypes.array,
  bannedUserFetch: PropTypes.object.isRequired,
  handleUnbanAllUsers: PropTypes.func.isRequired,
  bannedUserUnbanAll: PropTypes.object.isRequired,
  handleBanUnbanUser: PropTypes.func.isRequired,
  bannedUserBan: PropTypes.object.isRequired,
  bannedUserUnban: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
}

BannedUsersListModal.defaultProps = {
  bannedUsers: [],
  loading: false,
  open: false,
}

export default BannedUsersListModal;
