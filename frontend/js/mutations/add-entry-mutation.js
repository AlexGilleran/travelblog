import Relay from 'react-relay';

export default class AddEntryMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{addEntryToBlog}`;
  }

  getVariables() {
    return {
      blogId: this.props.blogId,
      title: this.props.entry.title,
      markdown: this.props.entry.markdown
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddEntryToBlogPayload {
        blog,
        entryEdge
      }
    `;
  }

  getConfigs() {
    return [
      {
        type: 'RANGE_ADD',
        parentName: 'blog',
        parentID: this.props.blogId,
        connectionName: 'entries',
        edgeName: 'entryEdge',
        rangeBehaviors: {
          '': 'append'
        }
      },
      {
        type: 'REQUIRED_CHILDREN',
        children: [Relay.QL`
          fragment on AddEntryToBlogPayload {
            entryEdge {
              node {
                entryId
              }
            }
          }
        `]
      }
    ];
  }

  static fragments = {

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