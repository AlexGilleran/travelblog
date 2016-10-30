import React from 'react';
import Relay from 'react-relay';

class DetailsView extends React.Component {
  render() {
    const details = this.props.details;

    return (
      <div>
        <div><strong>{details.userName}</strong></div>
        <div>Name: {details.displayName}</div>
        <div>Avatar: <img src={details.avatarUrl}/></div>
        <div>Bio: {details.bio}</div>
      </div>
    );
  }
}

export default Relay.createContainer(DetailsView, {
  fragments: {
    details: (variables) => Relay.QL`
      fragment on User {
        userName,
        displayName,
        avatarUrl
      }
    `
  }
});