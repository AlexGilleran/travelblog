var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var EntryStoreModule = require('../stores/entry-store');
var Link = require('react-router/modules/components/Link');

exports.constructor = function (ctx) {
  "use strict";

  var entryStore = ctx.injectSingleton(EntryStoreModule);

  return React.createClass({
    mixins: [Router.State, Reflux.ListenerMixin],

    getInitialState: function () {
      return entryStore.getEntry(this.getParams().entryId) || {};
    },

    componentWillMount: function () {
      this.listenTo(entryStore, this.onEntryChanged);
    },

    onEntryChanged: function () {
      this.setState(this.getInitialState());
    },

    componentWillReceiveProps: function (newProps) {
      this.setState(this.getInitialState());
    },

    componentDidMount: function () {
    },

    componentWillUnmount: function () {
    },

    render: function () {
      return (
        <div>
          <h2 className="col-1-1">
            {this.state.title}
          </h2>
          <div className="col-1-1">
            {this.state.markdown}
          </div>
          <div className="col-1-1">
            <If condition={this.state.blogId}>
              <Link to="blogs" params={this.state}>Back to Blog</Link>
            </If>
          </div>
        </div>
      );
    }
  });
};

exports.singletonKey = 'entry-view';