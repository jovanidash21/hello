import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import mapDispatchToProps from '../actions';
import Head from '../../components/Head';
import { LoadingAnimation } from '../../components/LoadingAnimation';

class Layout extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const { fetchActiveUser } = this.props;

    fetchActiveUser();
  }
  handleComponentRender(matchProps) {
    const {
      component: Content,
      title,
      user,
      chatRoom
    } = this.props;

    return (
      <Fragment>
        <Head title={"Chat App " + (title.length > 0 ? '| ' + title : '')} />
        {
          !user.fetchActive.loading &&
          user.fetchActive.success &&
          !chatRoom.fetch.loading &&
          chatRoom.fetch.success
            ?
            <Content {...matchProps} />
            :
            <LoadingAnimation name="pacman" color="#2a4160" fullScreen />
        }
      </Fragment>
    )
  }
  render() {
    const { component, ...rest } = this.props;

    return (
      <Route {...rest} render={::this.handleComponentRender} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    chatRoom: state.chatRoom
  }
}

Layout.propTypes = {
  component: PropTypes.func.isRequired,
  title: PropTypes.string
}

Layout.defaultProps = {
  title: ''
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);
