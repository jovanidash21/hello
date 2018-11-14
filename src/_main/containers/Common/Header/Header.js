import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Appbar } from 'muicss/react/';
import mapDispatchToProps from '../../../actions';
import { NewMessagesDropdown } from '../../../components/Header';
import { UserDropdown } from '../../../../components/UserDropdown';
import './styles.scss';

class Header extends Component {
  constructor(props) {
    super(props);
  }
  handleNewMessagesDropdownRender() {
    const {
      user,
      chatRoom,
      changeChatRoom,
      children
    } = this.props;
    const newMessagesChatRooms = chatRoom.all.filter((singleChatRoom) =>
      singleChatRoom.data.chatType !== 'public' &&
      singleChatRoom.unReadMessages > 0
    ).sort((a, b) => {
      var date = new Date(b.data.latestMessageDate) - new Date(a.data.latestMessageDate);
      var name = a.data.name.toLowerCase().localeCompare(b.data.name.toLowerCase());
      var priority = a.priority - b.priority;

      if ( date !== 0 ) {
        return date;
      } else if ( name !== 0 ) {
        return name
      } else {
        return priority;
      }
    });

    if ( !chatRoom.fetch.loading && chatRoom.fetch.success ) {
      return (
        <NewMessagesDropdown count={newMessagesChatRooms.length}>
          {
            newMessagesChatRooms.length > 0 &&
            newMessagesChatRooms.map((singleChatRoom, i) =>
              <NewMessagesDropdown.ChatRoom
                key={i}
                user={user.active}
                chatRoom={singleChatRoom}
                activeChatRoom={chatRoom.active}
                handleChangeChatRoom={changeChatRoom}
              />
            )
          }
        </NewMessagesDropdown>
      )
    }
  }
  render() {
    const {
      user,
      children
    } = this.props;

    return (
      <Appbar className="header">
        <table width="100%">
          <tbody>
            <tr style={{verticalAlign: 'middle'}}>
              <td className="mui--appbar-height">
                <div className="left-part-header">
                  {children}
                </div>
              </td>
              <td className="mui--appbar-height mui--text-right">
                {::this.handleNewMessagesDropdownRender()}
                <UserDropdown user={user.active} />
              </td>
            </tr>
          </tbody>
        </table>
      </Appbar>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    chatRoom: state.chatRoom
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
