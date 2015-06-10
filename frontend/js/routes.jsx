import React from 'react';
import {Router, Route, DefaultRoute, NotFoundRoute} from 'react-router';
import RootView from './components/common/root-view';
import BlogView from './components/blog/blog-view';
import HomeView from './components/home-view';
import EntryView from './components/entry/entry-view';

export default (
  <Route name="app" path="/" handler={RootView}>
    <Route name="blogs" path="blogs/:blogId" handler={BlogView}/>
    <Route name="entries" path="entries/:entryId" handler={EntryView}/>
    <DefaultRoute handler={HomeView}/>
    <NotFoundRoute handler={HomeView}/>
  </Route>
);