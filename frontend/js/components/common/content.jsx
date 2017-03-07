import React from 'react';
import styled from 'styled-components';
import {mediaQuery, contentWidth} from '../styles/responsive';
import variables from '../styles/variables';

const Root = styled.div`  
  ${mediaQuery(variables.breakpoints.handheld, variables.breakpoints.tablet)`
    // padding-top: ${variables.headerHeight};
  `};
  
  ${mediaQuery(variables.breakpoints.laptop, variables.breakpoints.desktop)`
    // margin-top: 10px;
  `};
  
  ${contentWidth}
  padding-top: 10px;
`;

export default function Content(props) {
  return (
    <Root>
      {props.children}
    </Root>
  );
}