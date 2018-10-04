import React, { Component } from 'react';
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
      user
    } = this.props;

    return (
      <div>
        <Head title={"Chat App " + (title.length > 0 ? '| ' + title : '')} />
        {
          !user.isFetchingActive && user.isFetchingActiveSuccess
            ?
            <Content {...matchProps} />
            :
            <LoadingAnimation name="pacman" color="#4bb06b" />
        }
      </div>
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
    user: state.user
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
