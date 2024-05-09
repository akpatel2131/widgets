import { useState } from "react";
import { AUTHOR, AUTHOR_ID, DELETE, MSG_ERROR, REPLY, SUPER_USER, EDIT } from "../lib/constants";
import {Button} from '@mui/material';
import CommentModal from "./CommentModal"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const theme = createTheme({
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          fontSize: '12px',
          fontWeight: '600'
        },
      },
    },
  },
});


export default function Comment({ comment, updateComments, deleteComments, editNewComment, LikeComment, reply=false }) {
    const nestedComments = (comment.children || []).map((comment) => {
      return <Comment key={comment.id} comment={comment} updateComments={updateComments} deleteComments={deleteComments} editNewComment={editNewComment} LikeComment={LikeComment} type="child" reply />;
    });

    const [isReplyClicked, setIsReplyClicked] = useState(false);
    const [isEditClicked, setIsEditClicked] = useState(false);
    const [inputVal, setInput] = useState('');
    const [messageError, setMessageError] = useState(false);
    const [editmessageError, setEditMessageError] = useState(false);
    const [editInputVal, setEditInput] = useState('');

    const onClickReply = (e) => {
        setMessageError(false);
        setInput('');
        setIsReplyClicked(!isReplyClicked);
    }

    const onEditClick = (text) => {
      setEditInput(text);
      setIsEditClicked(!isEditClicked);
    }
    
    const onInput = (e) => {
        setInput(e.target.value);
    }

    const onEditInput = (e) => {
      setEditInput(e.target.value);
    }

    const addComments = () => {
      if(inputVal){
        updateComments(comment.id, inputVal, comment);
        setIsReplyClicked(!isReplyClicked);
        setMessageError(false);
      } else {
        setMessageError(true);
      }
    }

    const editComments = (comment) => {
      if(editInputVal){
        editNewComment(comment, editInputVal);
        setIsEditClicked(!isEditClicked);
        setEditMessageError(false);
      } else {
        setEditMessageError(true);
      }
    }

    return (
      
      <div className={!reply? "commentContainer" : "replyContainer"}>
        <div className='innerContainer'>
            <div className="author">
            {comment.author}
            </div>
            <div>{comment.createdDate}</div>
        </div>
        <div className="commentAction">
          <div className='text'>{comment.text}</div>
          <div className="like">
            {!comment.likes.includes(AUTHOR_ID) ? <FavoriteBorderIcon fontSize="12px" color={!comment.likes.includes(AUTHOR_ID) ? "" : "error"} onClick={() =>LikeComment(comment)}/> : <FavoriteIcon fontSize="12px" color="error"/>}
            <span>{comment.likes.length}</span>
          </div>
        </div>
        <ThemeProvider theme={theme}>
            {(AUTHOR === comment.author) && <Button className="edit" onClick={(e) => onEditClick(comment.text)}>
                {EDIT}
            </Button>}
            {<Button className="reply" onClick={(e) => onClickReply(e)}>
                {REPLY}
            </Button>}
            {(AUTHOR === comment.author || SUPER_USER) && <Button className="delete" onClick={() => deleteComments(comment.id)} style={{ fontSize: "12px"}}>
                {DELETE}
            </Button>}
          </ThemeProvider>

      {nestedComments}


      <CommentModal 
        open={isReplyClicked || isEditClicked} 
        onBlur={(e) => (e.target.value = "")}  
        onChange={(e) => {
          if(isEditClicked) onEditInput(e);
          else onInput(e)
        }} 
        onSubmit={(e) => {
          if(isEditClicked) editComments(comment);
          else addComments(e)

          setIsReplyClicked(false)
          setIsEditClicked(false)
        }}
        handleClose={() => {
          setIsReplyClicked(false)
          setIsEditClicked(false)
        }}
        error={() => {
          if(editmessageError || messageError) return MSG_ERROR
        }}
      />
      </div>
      
    );
  }