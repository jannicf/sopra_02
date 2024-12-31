import React, { Component } from 'react';
import { List } from '@mui/material';
import StyleCard from './StyleCard';

class StyleList extends Component {
  render() {
    const { styles, onEdit, onDelete } = this.props;

    return (
      <List>
        {styles.map((style) => (
          <StyleCard
            key={style.getID()}
            style={style}
            onEdit={() => onEdit(style)}
            onDelete={() => onDelete(style)}
          />
        ))}
      </List>
    );
  }
}

export default StyleList;
