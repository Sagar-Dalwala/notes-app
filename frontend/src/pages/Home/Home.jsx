import { MdAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

import AddEditNotes from "./AddEditNotes";
import axiosInstance from "../../utils/axiosInstance";

import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

import AddNoteImg from "../../assets/addNote1.png";
import noDataImg from "../../assets/noData.svg";

const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);

  const [userInfo, setUserInfo] = useState(null);

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  //Get Use Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get(`https://notes-app-t23n.onrender.com/api/user/get-user`);
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  //Get all Notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get(`https://notes-app-t23n.onrender.com/api/notes/get-notes`);

      if (response.data && response.data.note) {
        setAllNotes(response.data.note);
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again later.");
    }
  };

  //Delete Notes
  const deleteNote = async (data) => {
    const noteId = data?._id;
    try {
      const response = await axiosInstance.delete(
        `https://notes-app-t23n.onrender.com/api/notes/delete-note/` + noteId
      );

      if (response.data) {
        showToastMessage("Note Deleted successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again later.");
    }
  };

  //Search for a note
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get(`https://notes-app-t23n.onrender.com/api/notes/search-notes/`, {
        params: { query },
      });
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
        setIsSearch(true);
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again later.");
    }
  };



  //Pin Note
  const updateIsPinned = async (data) => {
    const noteId = data?._id;
    try {
      const response = await axiosInstance.put(
        `https://notes-app-t23n.onrender.com/api/notes/update-note-pinned/` + noteId,
        {
          isPinned: !data.isPinned,
        }
      );

      if (response.data) {
        showToastMessage("Note Edited successfully", "add");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again later.");
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();

    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto px-4">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {allNotes.map((item, index) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? noDataImg : AddNoteImg}
            message={
              isSearch
                ? "Oops! No notes found matching your search."
                : `Start creating your first note! Click the 'Add' button to note down your thoughts, ideas, and reminders. Let's get started!`
            }
          />
        )}
      </div>

      <button
        className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-5 bottom-5 sm:right-10 sm:bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        {<MdAdd className="text-[24px] sm:text-[32px] text-white" />}
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}
        contentLabel=""
        className="w-full max-w-md sm:w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-auto"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={() =>
          setShowToastMsg({ isShown: false, message: "", type: "" })
        }
      />
    </>
  );
};

export default Home;
