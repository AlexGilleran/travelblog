import {Flummox} from 'flummox';
import BlogActions from './actions/blog-actions';
import EntryActions from './actions/entry-actions';
import BlogListStore from './stores/blog-list-store';
import BlogStore from './stores/blog-store';
import EntryStore from './stores/entry-store';
import LoginStateStore from './stores/login-state-store';
import LoginStateActions from './actions/login-state-actions.js';

export default class Flux extends Flummox {
  constructor() {
    super();

    this.createActions('blog', BlogActions);
    this.createActions('entry', EntryActions);
    this.createActions('login-state', LoginStateActions);

    this.createStore('blog-list', BlogListStore, this);
    this.createStore('blog', BlogStore, this);
    this.createStore('entry', EntryStore, this);
    this.createStore('login-state', LoginStateStore, this);
  }
}
