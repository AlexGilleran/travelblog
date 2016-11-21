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

const contentWidth = css`
  margin: 0 auto;
    
  ${mediaQuery(variables.breakpoints.handheld)`
    width: ${variables.breakpoints.handheld.contentWidth};  
    padding-left: 10px;
    padding-right: 10px;
  `}
  
  ${mediaQuery(variables.breakpoints.tablet)`
    max-width: ${variables.breakpoints.tablet.contentWidth};
  `}
  
  ${mediaQuery(variables.breakpoints.laptop)`
    max-width: ${variables.breakpoints.laptop.contentWidth};
  `}
  
  ${mediaQuery(variables.breakpoints.desktop)`
    max-width: ${variables.breakpoints.desktop.contentWidth};
  `}
`;

export {
  mediaQuery, contentWidth
}