import Relay from 'react-relay';

export default class LoginMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{login}`;
  }

  getVariables() {
    return {
      username: this.props.username,
      password: this.props.password
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on LoginPayload {
        viewer {
          currentUser
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        loggedIn: this.props.loggedIn,
      }
    }];
  }

  static fragments = {
    viewer: () => Relay.QL`
      fragment on Viewer {
        currentUser {
          userId
        }
      }
    `,
  };

  getOptimisticResponse() {
    var viewerPayload = {id: this.props.viewer.id};
    if (this.props.viewer.completedCount != null) {
      viewerPayload.completedCount = this.props.complete ?
      this.props.viewer.completedCount + 1 :
      this.props.viewer.completedCount - 1;
    }
    return {
      todo: {
        complete: this.props.complete,
        id: this.props.todo.id,
      },
      viewer: viewerPayload,
    };
  }
}