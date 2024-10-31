import React from "react";
import styled from "styled-components";
import { connect_wallet } from "./connect_wallet";
import Image from "next/image";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1a1a1a;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-radius: 56px;
`;

const Logo = styled.img`
  height: 50px;
  cursor: pointer;
  border-radius: 20px;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button`
  background: none;
  border: 2px solid #4a90e2;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  color: #4a90e2;
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #4a90e2;
    color: #ffffff;
  }
`;

const Navbar: React.FC = () => {
  return (
    <NavbarContainer>
      <Logo src="/logo-color.svg" alt="al" />
      <NavButtons>
        <NavButton>Store</NavButton>
        <NavButton onClick={connect_wallet}>Connect Wallet</NavButton>
        <NavButton>About</NavButton>
      </NavButtons>
    </NavbarContainer>
  );
};

export default Navbar;
