import React from 'react';
import styled from 'styled-components';

const BaseImage = styled.div`
  background-attachment: fixed;
  background-position: bottom left;
  background-size: cover;
  width: 100%;
  min-height: 100vh;
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;


const Alignments = {
  left: `
    align-items: flex-start;
  `,
  center: `
    align-items: center;
  `,
  right: `
    align-items: flex-end;
  `
};

export default function Picture(props) {
  const Image = styled(BaseImage)`
    background-image: url(${props.image});
    ${Alignments[props.align]}
  `;

  return (
    <Image>
      {/*React.Children.map(props.children, child => React.cloneElement(child, {
        align: props.align
      }))*/}
      {props.children}
    </Image>
  );
}