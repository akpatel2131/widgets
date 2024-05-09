
import Box from '@mui/material/Box';
import {Button, TextField} from '@mui/material';
import Modal from '@mui/material/Modal';


export default function CommentModal ({open, handleClose, onSubmit, onChange, onBlur, error}) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box className="commentModalContainer">
                <TextField 
                    label="Add new comment" 
                    variant="outlined" 
                    onBlur={onBlur}
                    onChange={onChange} 
                />
                <div className='commentModalActionButton'>
                    <Button className="comments" variant="contained" onClick={onSubmit}>
                    submit
                    </Button>
                    <Button className="comments" variant="outlined" onClick={handleClose}>
                    cancel
                    </Button>
                </div>
                <div style={{color: 'red', fontSize: '12px'}}>{error}</div>
            </Box>
        </Modal>
    )
}