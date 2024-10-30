import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import DragAndDropFile from "./DragAndDropFile";
import { verifyProof } from "../prover_utils";

function Opinion() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handler for when a file is selected in the DragAndDropFile component
  const handleFileSelect = async (file: File) => {
    await verifyProof(file);
    handleClose();
  };

  return (
    <div aria-hidden="true">
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Give opinion
      </Button>

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
    </div>
  );
}

export default Opinion;
