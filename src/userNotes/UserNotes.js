import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoteModal from "../components/models/NoteModal";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const UserNotes = () => {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUserProfile = async () => {
      try {
        if (!token) {
          // If no token, redirect to the login page
          navigate("/sign-in");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in header
            },
          }
        );

        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user profile", error);
        navigate("/sign-in"); // Redirect if token is invalid
      }
    };

    const fetchNotes = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/notes`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in header
            },
          }
        );
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes", error);
      } finally {
        setLoading(false); // Set loading to false after fetching notes
      }
    };

    fetchUserProfile();
    fetchNotes();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/sign-in");
  };
  const handleCreateNote = () => {
    setSelectedNote(null); // Clear selected note for creating a new one
    setIsModalOpen(true);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note); // Set the note to be edited
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmitNote = async (noteTitle) => {
    try {
      if (selectedNote) {
        // Edit existing note
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/notes/${selectedNote._id}`,
          noteTitle,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        // Create new note
        await axios.post(`${process.env.REACT_APP_BASE_URL}/notes`, noteTitle, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      // Refetch notes after submission
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/notes`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNotes(response.data);
      toast.success(
        selectedNote
          ? "Note updated successfully!"
          : "Note created successfully!"
      );
    } catch (error) {
      console.error("Error submitting note", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDeleteNote = async (noteId) => {
    // Show confirmation dialog using SweetAlert
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/notes/${noteId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Remove the deleted note from local state
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note._id !== noteId)
        );

        // Show success message
        Swal.fire("Deleted!", "Your note has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting note", error);
        Swal.fire("Error!", "Something went wrong. Please try again.", "error");
      }
    }
  };
  return (
    <StyledConatiner>
      <StyledHeader>
        <div className="icon-title-container">
          <div>
            <img src="images/icon.svg" alt="" />
          </div>
          <div className="title">Dashboard</div>
        </div>
        <div className="sign-out" onClick={handleSignOut}>
          {" "}
          <u>Sign out</u>
        </div>
      </StyledHeader>
      <StyledDiv>
        {user ? (
          <div className="user-info-and-button-div">
            <div className="user-email-name-div">
              <div>
                <StyledH1>Welcome, {user.name} !</StyledH1>
              </div>
              <div>
                <StyledP>Email: {user.email}</StyledP>
              </div>
            </div>
            <div>
              <StyledButton onClick={handleCreateNote}>
                Create Note
              </StyledButton>
            </div>

            {/* Render user's profile info here */}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </StyledDiv>
      <StyledNotesConatiner>
        <div>
          <StyledH5>Notes</StyledH5>
        </div>
        {loading ? (
          // Skeleton loader for notes
          Array(5)
            .fill(0)
            .map((_, index) => (
              <SkeletonNote key={index}>
                <Skeleton height={20} width={200} />
                <Skeleton height={20} width={20} />
              </SkeletonNote>
            ))
        ) : notes.length > 0 ? (
          notes.map((note) => (
            <StyledNotes key={note._id}>
              <div className="notes">
                <h6
                  className="notes-title"
                  onClick={() => handleEditNote(note)}
                >
                  {note.title.length > 50
                    ? `${note.title.slice(0, 50)}...`
                    : note.title}
                </h6>
                <img
                  src="/images/delete.svg"
                  alt=""
                  className="delete-icon"
                  onClick={() => handleDeleteNote(note._id)}
                />
              </div>
            </StyledNotes>
          ))
        ) : (
          <p>No notes available.</p>
        )}
      </StyledNotesConatiner>

      <NoteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmitNote}
        noteData={selectedNote}
      />
    </StyledConatiner>
  );
};

export default UserNotes;

const StyledConatiner = styled.div`
  padding: 16px;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;

  .icon-title-container {
    display: flex;
    gap: 14px;
    justify-content: center;
    align-items: center;
  }

  .title {
    color: #232323;
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 110%;
    letter-spacing: -0.5px;
  }

  .sign-out {
    color: #367aff;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    font-feature-settings: "liga" off, "clig" off;
    cursor: pointer;
  }
`;

const StyledButton = styled.button`
  border-radius: 10px;
  background: #367aff;
  padding: 16px 8px;
  border: none;
  color: white;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%;
  width: 250px;
  cursor: pointer;

  @media (max-width: 768px) {
    margin-top: 25px;
    width: 348px;
  }
`;

const StyledDiv = styled.div`
  padding: 46px 16px 0px;
  margin: 0 auto;
  max-width: 1200px;

  .user-info-and-button-div {
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 768px) {
      flex-direction: column; /* Stack items vertically on smaller screens */

      gap: 16px; /* Add spacing between items */
    }
  }

  .user-email-name-div {
    display: flex;
    flex-direction: column;
    width: 343px;
    height: auto; /* Allow dynamic height */
    padding: 16px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 10px;
    border: 1px solid #d9d9d9;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.59);
    @media (max-width: 768px) {
      width: 315px;
      padding: 16px;
      display: flex;
      justify-content: start;
      align-items: start;
    }
  }
`;

const StyledH1 = styled.h1`
  margin: 0;
  color: #232323;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
`;

const StyledP = styled.p`
  margin: 0;
  color: #232323;
  font-size: 16px;
  font-weight: 400;
  line-height: 250%;
`;

const StyledNotesConatiner = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  display: flex;
  gap: 15px;
  flex-direction: column;
`;

const StyledH5 = styled.h5`
  margin: 0;
  margin-top: 38px;
  color: #232323;
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;

  @media (max-width: 768px) {
    text-align: left;
  }
`;

const StyledNotes = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 15px;

  .notes {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    border-radius: 10px;
    border: 1px solid #d9d9d9;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.59);
  }

  .notes-title {
    margin: 0;
    color: #232323;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }

  .delete-icon {
    padding: 0;
    border: none;
    cursor: pointer;
  }
`;

const SkeletonNote = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.59);
  background-color: #f5f5f5;
`;
