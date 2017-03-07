import React from 'react';
import {Router, Route, IndexRoute} from 'react-router';
import RootView from './components/common/root-view';
import BlogView from './components/blog/blog-view';
import HomeView from './components/home/home-view';
import EditEntryView from './components/entry/editor/entry-edit-view';
import EntryReadView from './components/entry/view/entry-read-view';
import RegisterView from './components/user/register-view';
import UserView from './components/user/user-view';
import Preview from './components/preview/preview';
import {blog, viewer, entry} from './queries';

export default (
  <Route path="/"
         component={RootView}
         render={wrapper}
         queries={{viewer}}>
    <Route path="blogs/:blogId">
      <IndexRoute
        component={BlogView}
        prepareParams={prepareIds.bind(this, ["blog"])}
        queries={{viewer}}/>
      <Route path="entries">
        <Route
          path="add"
          component={EditEntryView}
          prepareParams={prepareIds.bind(this, ["blog"])}
          queries={{viewer}}/>
        <Route path=":entryId">
          <IndexRoute
            component={EntryReadView}
            queries={{viewer}}
            prepareParams={prepareIds.bind(this, ["blog", "entry"])}/>
          <Route
            path="edit"
            component={EditEntryView}
            queries={{viewer}}
            prepareParams={prepareIds.bind(this, ["blog", "entry"])}/>
        </Route>
      </Route>
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
        prepareParams={prepareIds.bind(this, ["user"])}
      />
    </Route>
    <Route path="preview"
      component={Preview}>
    </Route>
    <IndexRoute component={HomeView} queries={{viewer}}/>
  </Route>
);

function prepareIds(types, params) {
  return {
    params,
    ...types.reduce((acc, type) => {
      const idString = type + "Id";
      acc[idString] = parseInt(params[idString]);
      return acc;
    }, {})
  }
}

function wrapper({done, props, element}) {
  if (!done) {
    return (
      <div>
        <div>Loading...</div>
        {React.cloneElement(element, props)}
      </div>
    );
  }

  return React.cloneElement(element, props);
};