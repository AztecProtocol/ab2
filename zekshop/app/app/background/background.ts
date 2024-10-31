import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* Remove margin and padding from body */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    overflow-x: hidden;
  }
`;

export const BackgroundSection = styled.section`
  background-image: url('12400.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100%;
  position: relative;
`;

export const MainContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const NavbarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
`;