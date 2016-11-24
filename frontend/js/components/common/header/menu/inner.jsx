import React from 'react';
import styled from 'styled-components';
import variables from '../../../styles/variables';

const Root = styled.menu`
  position: absolute;
  right: 0;
  top: ${props => props.offsetTop};
  margin: 0;
`;

const List = styled.ul`
  list-style: none;
  margin: 0px;
`;

const Item = styled.li`
  height: 25px;
  width: 150px;
  text-align: right;
  background: #AAA;
  border-top: 3px solid #000;
  
  &:last-child {
    border-bottom: 3px solid #000;
  }
`;

export default function HeaderMenu(props) {
  return (
    <Root offsetTop={props.offsetTop}>
      <List>
        <Item>Hello</Item>
        <Item>Hello 2</Item>
      </List>
    </Root>
  )
}