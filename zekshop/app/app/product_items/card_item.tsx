import React, { useState } from "react";
import styled from "styled-components";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DragAndDropFile from "../opinion/DragAndDropFile";
import { verifyProof } from "../prover_utils";
import { toast } from "sonner";

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
  background-color: #1f1f1f;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.25s ease,
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
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handler for when a file is selected in the DragAndDropFile component
  const handleFileSelect = async (file: File) => {
    handleClose();
    const proof_verification_promise = verifyProof(file);
    toast.promise(proof_verification_promise, {
      loading: "Verifying your email...",
      success: () => {
        return `Verification successful! 🎉`;
      },
      error: "Verification failed",
    });
  };

  return (
    <Card>
      <CardImage src={imageUrl} alt="Product Image" />
      <CardActions>
        <ActionButton onClick={onBuyClick}>Buy</ActionButton>
        <ActionButton onClick={handleOpen}>Opinion</ActionButton>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Select a .eml File</DialogTitle>
          <DialogContent>
            <DragAndDropFile onFileSelect={handleFileSelect} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </CardActions>
    </Card>
  );
};
