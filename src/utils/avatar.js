import { isObjectEmpty } from './object';

/**
 * Handle chat room avatar badges
 * @param {Object} chatRoom
 * @param {Object} user
 * @param {string} type
 */
export function handleChatRoomAvatarBadges(chatRoom={}, user={}, type="account") {
  const isChatRoomEmpty = isObjectEmpty(chatRoom);
  const isUserEmpty = isObjectEmpty(user);

  if ( isChatRoomEmpty && isUserEmpty  ) {
    return '';
  }

  var roleChatType = '';
  var accountType = '';

  if ( !isChatRoomEmpty ) {
    switch ( chatRoom.chatType ) {
      case 'direct':
        if ( !isUserEmpty ) {
          var members = chatRoom.members;
          var memberIndex = members.findIndex(singleMember => singleMember._id !== user._id);

          if ( memberIndex > -1 ) {
            roleChatType = members[memberIndex].role;
            accountType = members[memberIndex].accountType;
          }
        }
        break;
      case 'public':
        roleChatType = 'public';
        break;
      default:
        break;
    }
  }

  if ( type === 'role-chat' ) {
    return roleChatType;
  }
  return accountType;
}
