import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Container,
  Row,
  Col
} from 'muicss/react';
import mapDispatchToProps from '../../../actions';
import { LoadingAnimation } from '../../../../components/LoadingAnimation';
import { ChatRoom } from '../../../components/ChatRoomsMenu';
import './styles.scss';

class ChatRoomsMenu extends Component {
  constructor(props) {
    super(props);
  }
  handleChatRoomsMenuRender() {
    const { chatRoom } = this.props;

    if ( !chatRoom.isFetching && chatRoom.isFetchingSuccess ) {
      return (
        <div className="chat-rooms-menu">
          <Container>
            <Row>
              <Col md="12">
                <h2 className="menu-title mui--text-center">Select a Public Chat Room</h2>
              </Col>
            </Row>
            <Row>
              {
                chatRoom.all.filter((singleChatRoom) =>
                  singleChatRoom.data.chatType === 'public'
                ).sort((a, b) =>  {
                  return new Date(a.data.createdAt) - new Date(b.data.createdAt);
                }).map((singleChatRoom, i) =>
                  <Col key={i} xs="12" md="6">
                    <ChatRoom
                      chatRoom={singleChatRoom}
                      handleSelectChatRoom={::this.handleSelectChatRoom}
                    />
                  </Col>
                )
              }
            </Row>
          </Container>

        </div>
      )
    } else {
      return (
        <LoadingAnimation name="ball-clip-rotate" color="black" />
      )
    }
  }
  handleSelectChatRoom(chatRoom) {
    const {
      user,
      changeChatRoom
    } = this.props;

    changeChatRoom(chatRoom, user.active._id, '');
  }
  render() {
    const { chatRoom } = this.props;

    return (
      <div className="chat-rooms-menu-wrapper">
        {::this.handleChatRoomsMenuRender()}
      </div>
    );
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
)(ChatRoomsMenu);
