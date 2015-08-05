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
    entry.entry.content = [
      {
        type: 'para',
        text: 'Blah blah blah blah hello mcblah',
        formatting: {
          bold: [3, 8, 10, 15],
          italic: [6, 9, 15, 20]
        }
      }, {
        type: 'para',
        text: 'this is para 2'
      }, {
        type: 'image',
        url: 'http://www.chanel.com/en_US/fragrance-beauty/views/assets/img/chanel_logo_blk.png',
        alt: 'blah blah'
      }, {
        type: 'para',
        text: 'this is para 3'
      }
    ];

    //console.log(entry);

    return entry;
  }
}