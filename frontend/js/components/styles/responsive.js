import {css} from 'styled-components';
import variables from './variables';
import {combine} from './util';

function mediaQuery(...types) {
  return (...args) => {
    const queries = types
      .map(type => [
        'screen',
        type.min && `(min-width: ${type.min})`,
        type.max && `(max-width: ${type.max})`
      ].filter(string => !!string)
        .join(' and '))

    const fullQuery = queries
      .join(', ');

    return css`@media ${fullQuery} {
       ${ css(...args) }
    }`;
  }
}

export {
  mediaQuery
}