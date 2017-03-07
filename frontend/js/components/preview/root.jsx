import React from 'react';
import Preview from './preview';
import Content from '../common/content';
import styled from 'styled-components';

const Background = styled.div`
  background-color: #333;
  background-position: top left;
  background-size: contain;
  color: #FFF;
  min-width: 100%;
  min-height: 100%;
  position: absolute;
`;

export default function Root(props) {
  return (
    <Background>
      <Preview />
    </Background>
  );
}