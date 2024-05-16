import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CommentList = ({ commentId, userId, name, text, onDelete, onEdit }) => {
    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt={name} src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
                primary={name}
                secondary={
                    <>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            {text}
                        </Typography>
                        {userId && (
                            <React.Fragment>
                                <IconButton onClick={onEdit} size="small">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={onDelete} size="small">
                                    <DeleteIcon />
                                </IconButton>
                            </React.Fragment>
                        )}
                    </>
                }
            />
        </ListItem>
    );
};

export default CommentList;
