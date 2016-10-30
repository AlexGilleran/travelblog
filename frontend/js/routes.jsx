import React from 'react';
import {Router, Route, IndexRoute} from 'react-router';
import RootView from './components/common/root-view';
import BlogView from './components/blog/blog-view';
import HomeView from './components/home-view';
import EntryWrapperView from './components/entry/entry-wrapper-view';
import EntryEditView from './components/entry/editor/entry-edit-view';
import EntryReadView from './components/entry/view/entry-read-view';
import RegisterView from './components/user/register-view';
import UserView from './components/user/user-view';
import {blog, viewer, entry} from './queries';

export default (
  <Route path="/"
         component={RootView}
         queries={{viewer}}>
    <Route path="blogs/:blogId"
           component={BlogView}
           prepareParams={prepareId.bind(this, "blog")}
           queries={{viewer}}/>
    <Route path="entries/:entryId"
           component={EntryWrapperView}
           queries={{viewer}}
           prepareParams={prepareId.bind(this, "entry")}>
      <IndexRoute component={EntryReadView}/>
      <Route path=":entryId/edit" component={EntryEditView}/>
    </Route>
    <Route path="users">
      <Route
        path="register"
        component={RegisterView}
        queries={{viewer}}
      />
      <Route
        path=":userId"
        component={UserView}
        queries={{viewer}}
        prepareParams={prepareId.bind(this, "user")}
      />
    </Route>
    <IndexRoute component={HomeView} queries={{viewer}}/>
  </Route>
);

function prepareId(type, params) {
  const idString = type + "Id";

  return Object.assign(params, {
    [idString]: parseInt(params[idString])
  });
}