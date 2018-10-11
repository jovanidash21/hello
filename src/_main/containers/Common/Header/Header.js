import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Appbar } from 'muicss/react/';
import mapDispatchToProps from '../../../actions';
import { UserDropdown } from '../../../../components/UserDropdown';
import './styles.scss';

class Header extends Component {
  constructor(props) {
    super(props);
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
    user: state.user
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
