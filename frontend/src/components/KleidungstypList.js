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
        const { kleidungstypen, kleiderschrankId } = this.props;
       console.log("KleidungstypList - Kleidungstypen mit Verwendungen:",
            this.props.kleidungstypen.map(kt => ({
                id: kt.getID(),
                bezeichnung: kt.getBezeichnung(),
                verwendungen: kt.getVerwendungen()
            }))
        );

        return (
            <List>
                {kleidungstypen.map(kleidungstyp => (
                    <KleidungstypCard
                        key={`kleidungstyp-${kleidungstyp.getID()}-${kleidungstyp.getBezeichnung()}`}
                        kleidungstyp={kleidungstyp}
                        kleiderschrankId={kleiderschrankId}
                        onDelete={this.props.onDelete}
                        onUpdate={this.props.onUpdate}
                    />
                ))}
            </List>
        );
    }
}

export default KleidungstypList;