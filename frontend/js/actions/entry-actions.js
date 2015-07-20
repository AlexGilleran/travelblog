import {Actions} from 'flummox';
import api from '../api';
import {catchArguments} from './action-utils';

export default class EntryActions extends Actions {
  async createEntry(entry) {
    return await api.createEntry(entry);
  }

  async updateEntry(entry) {
    await api.updateEntry(entry);
    return entry;
  }

  async getEntry(id) {
    const entry = await catchArguments(api.getEntry, id);
    entry.id = id;
    return entry;
  }
}