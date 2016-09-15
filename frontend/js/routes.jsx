import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import RootView from './components/common/root-view';
import BlogView from './components/blog/blog-view';
import HomeView from './components/home-view';
import EntryWrapperView from './components/entry/entry-wrapper-view';
import EntryEditView from './components/entry/editor/entry-edit-view';
import EntryReadView from './components/entry/view/entry-read-view';
import RegisterView from './components/user/register-view';
import UserView from './components/user/user-view';
import ViewerQueries from './queries/viewer-queries';

export default [
  {
    path: '/',
    component: RootView,
    // queries: ViewerQueries,
    indexRoute: {
      component: HomeView,
      queries: {
        viewer: () => Relay.QL`query { viewer }`
      },
      prepareParams: () => ({status: 'any'}),
    },
    childRoutes: [
      {
        path: 'blogs/:blogId',
        prepareParams: prepareWidgetListParams,
        component: BlogView,
        queries: ViewerQueries
      },
    ],
  }

  // <Route path="/" component={RootView}>
  //   <Route path="blogs/:blogId" component={BlogView}/>
  //   <Route path="entries" component={EntryWrapperView}>
  //     <Route path=":entryId" component={EntryReadView}/>
  //     <Route path=":entryId/edit" component={EntryEditView}/>
  //   </Route>
  //   <Route path="users">
  //     <Route path="register" component={RegisterView}/>
  //     <Route path=":userId" component={UserView}/>
  //   </Route>
  //   <IndexRoute component={HomeView}/>
  // </Route>
];

function prepareWidgetListParams(params) {
  return Object.assign(
    params,
    {blogId: parseInt(params.blogId)}
  );
};