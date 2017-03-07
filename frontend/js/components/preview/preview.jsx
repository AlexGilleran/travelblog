import React from 'react';
import Paragraph from './paragraph';
import Picture from './picture';
import styled from 'styled-components';
import lake from './pictures/lake.png';
import glacier from './pictures/glacier.png';

const Root = styled.div`
`;

const Title = styled.h1`
  text-align: center;
`;

const Paragraphs = styled.div`
`;

export default function Preview() {
  return (
    <Root>
      <Title>This is a Title</Title>
      <Paragraphs>
        <Picture image={lake} align="right">
          <Paragraph />
          <Paragraph />
          <Paragraph />
        </Picture>
        <Picture image={glacier} align="left">
          <Paragraph />
          <Paragraph />
        </Picture>
      </Paragraphs>
    </Root>
  );
}