import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemText, IconButton, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

class OutfitList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outfit: props.outfit,
      showDeleteDialog: false
    };
  }

  handleDelete = () => {
    this.props.onOutfitDeleted(this.state.outfit);
  }

  render() {
    const { outfit } = this.state;

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
                {outfit.getStyle().getName()}
              </Typography>
            }
            secondary={
              <Typography variant="body2" color="text.secondary">
                {`Enthält ${outfit.getBausteine().length} Kleidungsstücke`}
              </Typography>
            }
          />
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={this.handleDelete}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </ListItem>
    );
  }
}

OutfitList.propTypes = {
  outfit: PropTypes.object.isRequired,
  onOutfitDeleted: PropTypes.func.isRequired
};

export default OutfitList;