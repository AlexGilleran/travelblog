import {Flummox} from 'flummox';

import BlogActions from './actions/blog-actions';
import BlogStore from './stores/blog-store';

import EntryActions from './actions/entry-actions';
import EntryStore from './stores/entry-store';

import BlogListStore from './stores/blog-list-store';

import LoginStateStore from './stores/login-state-store';
import LoginStateActions from './actions/login-state-actions.js';

import UserActions from './actions/user-actions';
import UserStore from './stores/user-store';

export default class Flux extends Flummox {
  constructor() {
    super();

    this.createActions('blog', BlogActions);
    this.createActions('entry', EntryActions);
    this.createActions('login-state', LoginStateActions);
    this.createActions('user', UserActions);

    this.createStore('blog-list', BlogListStore, this);
    this.createStore('blog', BlogStore, this);
    this.createStore('entry', EntryStore, this);
    this.createStore('login-state', LoginStateStore, this);
    this.createStore('user', UserStore, this);
  }
}
