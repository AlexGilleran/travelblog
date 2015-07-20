import React from 'react';
import {Router, Route, DefaultRoute, NotFoundRoute} from 'react-router';
import RootView from './components/common/root-view';
import BlogView from './components/blog/blog-view';
import HomeView from './components/home-view';
import EntryWrapperView from './components/entry/entry-wrapper-view';
import EntryEditView from './components/entry/entry-edit-view';
import EntryReadView from './components/entry/entry-read-view';
import RegisterView from './components/user/register-view';

export default (
  <Route name="app" path="/" handler={RootView}>
    <Route name="blog" path="blogs/:blogId" handler={BlogView}/>
    <Route name="entry" path="entries" handler={EntryWrapperView}>
      <Route name="viewEntry" path=":entryId" handler={EntryReadView} />
      <Route name="editEntry" path=":entryId/edit" handler={EntryEditView} />
    </Route>
    <Route name="register" path="register" handler={RegisterView}/>
    <DefaultRoute handler={HomeView}/>
    <NotFoundRoute handler={HomeView}/>
  </Route>
);