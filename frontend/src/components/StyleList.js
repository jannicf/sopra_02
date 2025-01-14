import React, { Component } from 'react';
import { Grid } from '@mui/material';
import StyleCard from './StyleCard';

class StyleList extends Component {
    render() {
        const { styles, onEdit, onDelete, onStyleClick } = this.props;

        return (
            <Grid container spacing={3}>
                {styles.map((style) => (
                    <Grid item xs={12} sm={6} md={4} key={style.getID()}>
                        <StyleCard
                            style={style}
                            onEdit={(e) => onEdit(style, e)}
                            onDelete={(e) => onDelete(style, e)}
                            onClick={() => onStyleClick(style)}
                        />
                    </Grid>
                ))}
            </Grid>
        );
    }
}

export default StyleList;