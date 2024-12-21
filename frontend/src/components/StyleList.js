import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemText, IconButton, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

class StyleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: props.style,
      showDeleteDialog: false,
      showEditDialog: false
    };
  }

  handleDelete = () => {
    this.props.onStyleDeleted(this.state.style);
  }

  handleEdit = () => {
    this.props.onStyleEdit(this.state.style);
  }

  render() {
    const { style } = this.state;

    return (
      <ListItem
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          mb: 1,
          '&:hover': {
            backgroundColor: '#f5f5f5'
          }
        }}
      >
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          <ListItemText
            primary={
              <Typography variant="h6" component="div">
                {style.getName()}
              </Typography>
            }
            secondary={
              <Typography variant="body2" color="text.secondary">
                {`Enthält ${style.getFeatures().length} Kleidungstypen und ${style.getConstraints().length} Constraints`}
              </Typography>
            }
          />
          <Box>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={this.handleEdit}
              sx={{ color: 'primary.main', mr: 1 }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={this.handleDelete}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </ListItem>
    );
  }
}

StyleList.propTypes = {
  style: PropTypes.object.isRequired,
  onStyleDeleted: PropTypes.func.isRequired,
  onStyleEdit: PropTypes.func.isRequired
};

export default StyleList;