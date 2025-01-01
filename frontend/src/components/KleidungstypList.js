import React, { Component } from 'react';
import { List } from '@mui/material';
import KleidungstypCard from './KleidungstypCard';

class KleidungstypList extends Component {
    handleKleidungstypDelete = async (kleidungstyp) => {
        try {
            // Rufe die von der übergeordneten Komponente übergebene onDelete-Funktion auf
            await this.props.onDelete(kleidungstyp);
        } catch (error) {
            console.error('Error deleting Kleidungstyp:', error);
        }
    }

    render() {
        const { kleidungstypen } = this.props;

        return (
            <List>
                {kleidungstypen.map(kleidungstyp => (
                    <KleidungstypCard
                        key={kleidungstyp.getID()}
                        kleidungstyp={kleidungstyp}
                        onDelete={this.handleKleidungstypDelete}
                        onUpdate={this.props.onUpdate}
                    />
                ))}
            </List>
        );
    }
}

export default KleidungstypList;