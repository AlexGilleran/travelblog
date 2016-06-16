var React = require('react');
var {Link} =  require('react-router');
var _ = require('lodash');

export default class EditUserView extends React.Component {
  constructor() {
    super();
  }

  getUserDetails() {
    return {
      userName: this.refs.userName.getDOMNode().value,
      email: this.refs.email.getDOMNode().value,
      displayName: this.refs.displayName.getDOMNode().value,
      avatarUrl: this.refs.avatar.getDOMNode().value,
      passwordHash: this.refs.password.getDOMNode().value, // TODO: Obviously this isn't actually a hash, change this
      // when we split password off from user.
      bio: this.refs.bio.getDOMNode().value
    }
  }

  render() {
    return (
      <div>
          <input type="text" placeholder="Username" defaultValue={this.props.userDetails.userName} ref="userName" />
          <input type="text" placeholder="Email Address" defaultValue={this.props.userDetails.email} ref="email" />
          <input type="text" placeholder="Name" defaultValue={this.props.userDetails.displayName} ref="displayName" />
          <input type="text" placeholder="Avatar URL" defaultValue={this.props.userDetails.avatarUrl} ref="avatar" />
          <input type="password" placeholder="Password" ref="password" />
          <input type="password" placeholder="Repeat Password" ref="passwordRepeat" />
          <textarea ref="bio" defaultValue={this.props.userDetails.bio} />
      </div>
    );
  }
}

EditUserView.defaultProps = {
  userDetails: {}
};