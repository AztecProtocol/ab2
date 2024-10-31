import React from "react";
import styled from "styled-components";

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(300px, 1fr)
  ); /* Responsive columns */
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin-top: 2rem;
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`;

const ActionButton = styled.button`
  background-color: #4a90e2;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;

  &:hover {
    background-color: #1e3a8a;
  }

  &:active {
    transform: scale(0.95);
  }
`;

interface CardItemProps {
  imageUrl: string;
  onBuyClick: () => void;
  onOpinionClick: () => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  imageUrl,
  onBuyClick,
  onOpinionClick,
}) => {
  return (
    <Card>
      <CardImage src={imageUrl} alt="Product Image" />
      <CardActions>
        <ActionButton onClick={onBuyClick}>Buy</ActionButton>
        <ActionButton onClick={onOpinionClick}>Opinion</ActionButton>
      </CardActions>
    </Card>
  );
};
