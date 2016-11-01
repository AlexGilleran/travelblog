import Relay from 'react-relay';

export default class UpdateEntryMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{updateEntry}`;
  }

  getVariables() {
    return {
      entryId: this.props.entry.entryId,
      markdown: this.props.markdown,
      title: this.props.title
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateEntryPayload {
        entry
      }
    `;
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          entry: this.props.entry.id
        }
      }
    ];
  }

  static fragments = {
    entry: () => Relay.QL`
      fragment on Entry {
        entryId,
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