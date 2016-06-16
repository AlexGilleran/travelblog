var React = require('react');
var {Link} =  require('react-router');
var EditUserView = require('./edit-user-view');
var {Navigation} = require('react-router');

export default class RegisterView extends React.Component {
  render() {
    return (
      <FluxComponent flux={this.props.flux} connectToStores="login-state">
        <Inner />
      </FluxComponent>
    );
  }
}

var Inner = React.createClass({
  mixins: [Navigation],

  componentWillReceiveProps: function(props) {
    this.redirectIfLoggedIn(props);
  },

  redirectIfLoggedIn: function(props) {
    if (props.userDetails) {
      this.replaceWith('/');
    }
  },

  onSubmit: function(event) {
    event.preventDefault();

    const userDetails = this.refs.editUserView.getUserDetails();

    const register = this.props.flux.getActions('login-state').register;

    register(this.refs.editUserView.getUserDetails());
  },

  render: function() {
    return (
      <div>
          <form onSubmit={this.onSubmit}>
            <EditUserView userDetails={this.props.userDetails} ref="editUserView" />
            <input type="submit" value="Register" />
          </form>
      </div>
    );
  }
});