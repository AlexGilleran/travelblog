import {Actions} from 'flummox';
import api from '../api';
import actionUtils from './action-utils';

export default class EntryActions extends Actions {
  async createEntry(entry) {
    return await api.createEntry(entry);
  }

  async getEntry(id) {
    const entry = await actionUtils.catchArguments(api.getEntry, id);
    entry.id = id;
    return entry;
  }
}