import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import the Close icon
import styled from "styled-components";
import toast from "react-hot-toast";

const NoteModal = ({ isOpen, onClose, onSubmit, noteData = null }) => {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  // Prefill data for editing a note
  useEffect(() => {
    if (noteData) {
      setNoteTitle(noteData.title);
      setNoteContent(noteData.content);
    } else {
      setNoteTitle("");
      setNoteContent("");
    }
  }, [noteData, isOpen]);

  const handleTitleChange = (e) => {
    setNoteTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setNoteContent(e.target.value);
  };

  const handleSubmit = () => {
    if (noteTitle.trim() === "" || noteContent.trim() === "") {
      toast.error("Both title and content are required!");
      return;
    }

    // Create an object in the desired format
    const note = {
      title: noteTitle,
      content: noteContent,
    };

    onSubmit(note); // Pass the note object to the parent
    onClose(); // Close the modal
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "85%", sm: 400 },
          height: { xs: "auto", sm: "auto" }, // Auto height for both xs and sm screens
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: { xs: 2, sm: 3 }, // Adjust padding for smaller screens
          borderRadius: 2,
          position: "relative", // This is important to position the close icon in the top-right corner
        }}
      >
        {/* Close icon */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: { xs: 10, sm: 20 },
            right: 8,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {noteData ? "Edit Note" : "Create Note"}
        </Typography>
        <TextField
          label="Note Title"
          value={noteTitle}
          onChange={handleTitleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Note Content"
          value={noteContent}
          onChange={handleContentChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <Box display="flex" justifyContent="end" mt={2}>
          <StyledButton onClick={handleSubmit}>
            {noteData ? "Update" : "Create"}
          </StyledButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default NoteModal;

const StyledButton = styled.button`
  border-radius: 10px;
  background: #367aff;
  padding: 12px 8px;
  border: none;
  color: white;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  width: 100px;
  cursor: pointer;
`;
