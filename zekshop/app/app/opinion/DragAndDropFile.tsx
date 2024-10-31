import React, { useState, useCallback } from "react";

interface DragAndDropFileProps {
  onFileSelect: (file: File) => void; // Callback to send selected file to parent component
}

const DragAndDropFile: React.FC<DragAndDropFileProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [label, setLabel] = useState(
    "Drag and drop a .eml file here, or click to select one"
  );

  // Handler for drag events
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
    setLabel("Drop the .eml file here...");
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
    setLabel("Drag and drop a .eml file here, or click to select one");
  }, []);

  // Handler for drop events
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      setLabel("Drag and drop a .eml file here, or click to select one");

      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith(".eml")) {
        onFileSelect(file);
        console.log("Selected file drop:", file);
      } else {
        alert("Please upload a .eml file");
      }
    },
    [onFileSelect]
  );

  // File selection via click
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.name.endsWith(".eml")) {
        onFileSelect(file);
      } else {
        alert("Please upload a .eml file");
      }
    },
    [onFileSelect]
  );

  return (
    <div
      aria-hidden="true"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("fileInput")?.click()}
      style={{
        border: dragActive ? "2px dashed #4A90E2" : "2px dashed #CCCCCC",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        cursor: "pointer",
        backgroundColor: dragActive ? "#f0f8ff" : "#ffffff",
      }}
    >
      <p>{label}</p>
      <input
        id="fileInput"
        type="file"
        accept=".eml"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default DragAndDropFile;
