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
        text: 'Blah _b*l*a_h *b_l_a*h _h*e_l*o *b\\_l*a\\_h mcblah'
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