import React, { useState, useEffect } from "react";
import "../src/styles/App.css";
import Comment from "./components/Comment";
import TreeCreation from "./components/Tree";
import { initialComments } from "./mockData";
import { WIDGET, MSG_ERROR, ADD_COMMENT, AUTHOR_ID } from "./lib/constants";
import {
  setLocalStorage,
  checkLocalData,
  getLocalStorage
} from "./lib/localStorage";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import {Button, MenuItem, Select} from '@mui/material';
import CommentModal from "./components/CommentModal";

/*

Tasks Completed :

1) Adding a new comment
2) Edit/Delete/Reply functionality Added
3) Delete comment, deleted all nested as well
4) Local Storage used to persist data
5) Creation date added
6) Validations added
7) Current user can edit/delete only and only his/her comments
8) Super User can delete any comment of post
9) UI neat and clean
10) Standard Modules/Folder structure followed

*/

// make SUPER_USER = true in constants.js file, for additional permissions

const theme = createTheme({
  components: {
    MuiSelect:{
      styleOverrides:{
        root: {
          width: '300px'
        }
      }
    }
  },
});

function App() {
  let [comments, setComments] = useState(initialComments);
  const [newCommentsValue, setNewCommentsValue] = useState("");
  const [error, setError] = useState(false);
  const [viewCommentModal, setViewCommentModal] = useState(false);

  useEffect(() => {
    setLocalStorage(initialComments)
  }, []);

  useEffect(() => {
    if (checkLocalData()) {
      setComments(getLocalStorage());
    }
  }, []);

  const createDate = () => {
    const date = new Date();
    const d =
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      " " +
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0") +
      ":" +
      date.getSeconds().toString().padStart(2, "0");
    return d;
  };

  const sortComment = (value) => {

    let commentData = [...comments];

    switch (value) {
      case "DATE_ASENDING" : {
        commentData.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
      }
      case "DATE_DECENDING" : {
        commentData.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      }
      case "LIKE_ASENDING" : {
        commentData.sort((a,b) => a["likes"].length - b["likes"].length);
        break;
      }
      case "LIKE_DECENDING" : {
        commentData.sort((a,b) =>  b["likes"].length - a["likes"].length )
        break;
      }
    }

    setComments(commentData);
    setLocalStorage(commentData);

  }


  const updateComments = (id, text, comments) => {
    const commentAdditional = {
      id: Date.now(),
      text: text,
      author: "Mayank",
      children: null,
      parentId: id,
      createdDate: createDate(),
      likes: comments.likes,
    };
    const updatedComments = [...comments, commentAdditional];
    setComments(updatedComments);
    setLocalStorage(updatedComments);
  };

  const deleteComments = (id) => {
    let remainingValues = comments.filter((item) => {
      if (item.parentId !== id && item.id !== id) {
        return item;
      }
    });

    setComments(remainingValues);
    setLocalStorage(remainingValues);
  };

  const LikeComment = (comment) => {
    comments = comments.filter((item) => item.id !== comment.id);

      const likeComment = {
        id: comment.id,
        text: comment.text,
        author: comment.author,
        children: comment.children,
        parentId: comment.parentId,
        createdDate: comment.createdDate,
        likes: [...comment.likes, AUTHOR_ID]
      };
      const allComments = [likeComment, ...comments];
      setComments(allComments);
      setLocalStorage(allComments);
    
  }

  const addNewComment = (e) => {
    if (newCommentsValue) {
      const newComment = {
        id: Date.now(),
        text: newCommentsValue,
        author: "Mayank",
        children: null,
        parentId: null,
        createdDate: createDate(),
        likes: 0
      };
      setError(false);
      const allComments = [...comments, newComment];
      setComments(allComments);
      setLocalStorage(allComments);
      // setNewCommentsValue('');
    } else {
      setError(true);
    }
  };

  const editNewComment = (comment, text) => {
    if (text) {
      comments = comments.filter((item) => item.id !== comment.id);

      const editComment = {
        id: comment.id,
        text: text,
        author: "Mayank",
        children: comment.children,
        parentId: comment.parentId,
        createdDate: createDate(),
        likes: comment.likes
      };
      // setError(false);
      const allComments = [editComment, ...comments];
      setComments(allComments);
      setLocalStorage(allComments);
    } else {
      // setError(true);
    }
  };

  const commentTree = TreeCreation(comments);

  return (
    <>
      <div className="plainText" style={{ textDecoration: "underline" }}>
        {" "}
        {WIDGET}{" "}
      </div>
      <div className="plainText">
        Hi there, this is my first post after a while.
      </div>
      <div className="newComment">
      <ThemeProvider theme={theme}> 
        <Select onChange={(event) => {
          sortComment(event.target.value)
        }}>
            <MenuItem value="DATE_ASENDING">
                Sort By date - acending
            </MenuItem>
            <MenuItem value="DATE_DECENDING">
                Sort By date - decending
            </MenuItem>
            <MenuItem value="LIKE_ASENDING">
                Sort By Like - acending
            </MenuItem>
            <MenuItem value="LIKE_DECENDING">
                Sort By Like - decending
            </MenuItem>
          </Select>
      </ThemeProvider>
        <Button className="comments" variant="contained" onClick={() => setViewCommentModal(true)}>
          {" "}
          {ADD_COMMENT}{" "}
        </Button>
        {error && (
          <div style={{ color: "red", fontSize: "12px" }}>{MSG_ERROR}</div>
        )}
      </div>
      <div className="commentSection">
        {commentTree.map((comment) => {
          return (
            <Comment
              key={comment.id}
              comment={comment}
              updateComments={updateComments}
              deleteComments={deleteComments}
              editNewComment={editNewComment}
              LikeComment={LikeComment}
            />
          );
        })}
        <br />
        <br />
      </div>

      <CommentModal 
        open={viewCommentModal} 
        onBlur={(e) => (e.target.value = "")}  
        onChange={(e) => setNewCommentsValue(e.target.value)} 
        onSubmit={(e) => {
          addNewComment(e)
          setViewCommentModal(false)
        }}
        handleClose={() => setViewCommentModal(false)}
      />
    </>
  );
}

export default App;
