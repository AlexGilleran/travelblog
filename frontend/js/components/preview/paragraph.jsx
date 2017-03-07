import React from 'react';
import styled from 'styled-components';


export default function Paragraph(props) {
  const Root = styled.p`
    padding-bottom: 29px;
    font-size: 19px;
    line-height: 1.58;
    letter-spacing: -.003em;
    max-width: 500px;
  `;

  return (
    <Root>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sodales mi ac dui lobortis dapibus. Donec
      blandit pharetra metus sit amet congue. Cras ut tellus ac quam dignissim vulputate quis sit amet quam. Sed
      sagittis, lacus quis ultricies varius, justo nulla blandit ipsum, nec convallis odio mauris ut elit. Fusce
      placerat orci ac efficitur ullamcorper. Aenean porta nulla sit amet orci iaculis, sed viverra neque tincidunt.
      Phasellus ex augue, viverra sed dui ut, tempor malesuada leo.
    </Root>
  );
}