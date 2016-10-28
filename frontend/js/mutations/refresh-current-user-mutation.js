import Relay from 'react-relay';

export default class RefreshCurrentUserMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{refreshCurrentUser}`;
  }

  getVariables() {
    return {};
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RefreshCurrentUserPayload {
        viewer {
          currentUser
        }
      }
    `;
  }

  getConfigs() {
    return [
      {
        type: 'REQUIRED_CHILDREN',
        children: [this.getFatQuery()]
      },
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          viewer: this.props.viewer.id
        }
      }];
  }

  static fragments = {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
      }
    `
  };

  // getOptimisticResponse() {
  //   var viewerPayload = {id: this.props.viewer.id};
  //   if (this.props.viewer.completedCount != null) {
  //     viewerPayload.completedCount = this.props.complete ?
  //     this.props.viewer.completedCount + 1 :
  //     this.props.viewer.completedCount - 1;
  //   }
  //   return {
  //     todo: {
  //       complete: this.props.complete,
  //       id: this.props.todo.id,
  //     },
  //     viewer: viewerPayload,
  //   };
  // }
}