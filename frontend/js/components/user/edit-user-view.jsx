import React from 'react';
import {Link} from 'react-router';
var _ = require('lodash');

export default class EditUserView extends React.Component {
  constructor() {
    super();
  }

  getUserDetails() {
    return {
      userName: this.userName.value,
      email: this.email.value,
      displayName: this.displayName.value,
      avatarUrl: this.avatar.value,
      passwordHash: this.password.value, // TODO: Obviously this isn't actually a hash, change this
      // when we split password off from user.
      bio: this.bio.value
    }
  }

  render() {
    return (
      <div>
        <div>
          <input type="text" placeholder="Username" defaultValue={this.props.userDetails.userName} ref={node => this.userName = node} />
        </div>
        <div>
          <input type="text" placeholder="Email Address" defaultValue={this.props.userDetails.email} ref={email => this.email = email} />
        </div>
        <div>
          <input type="text" placeholder="Name" defaultValue={this.props.userDetails.displayName} ref={displayName => this.displayName = displayName} />
        </div>
        <div>
          <input type="text" placeholder="Avatar URL" defaultValue={this.props.userDetails.avatarUrl} ref={avatar => this.avatar = avatar} />
        </div>
        <div>
          <input type="password" placeholder="Password" ref={password => this.password = password} />
        </div>
        <div>
          <input type="password" placeholder="Repeat Password" ref={repeat => this.passwordRepeat = repeat} />
        </div>
        <div>
          <textarea defaultValue={this.props.userDetails.bio} placeholder="Bio" ref={bio => this.bio = bio} />
        </div>
      </div>
    );
  }
}

EditUserView.defaultProps = {
  userDetails: {}
};