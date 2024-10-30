import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import DragAndDropFile from "./DragAndDropFile";
import { file2Base64, verifyProof } from "../prover_utils";

function Opinion() {
  const [open, setOpen] = useState(false);

  // Opens the dialog
  const handleOpen = () => setOpen(true);

  // Closes the dialog
  const handleClose = () => setOpen(false);

  // Handler for when a file is selected in the DragAndDropFile component
  const handleFileSelect = async (file: File) => {
    console.log("handleFileSelect");
    console.log("Selected file:", file);
    const file_in_base64 = await file2Base64(file);
    const x = await verifyProof(file_in_base64, file);
    console.log("x: ", x);
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
