import React, { Component } from 'react';
import { Typography} from '@mui/material';
import StyleForm from "../dialogs/StyleForm";
import StyleDeleteDialog from "../dialogs/StyleDeleteDialog";
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import StyleList from '../components/StyleList';

class StylesView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            styles: [],
            selectedStyle: null,
            showFormDialog: false,
            showDeleteDialog: false,
            loadingInProgress: false,
            error: null,
            kleiderschrankId: null
        };
    }

    componentDidMount() {
        KleiderschrankAPI.getAPI()
            .getPersonByGoogleId(this.props.user?.uid)
            .then(person => {
                if (person && person.getKleiderschrank()) {
                    const kleiderschrankId = person.getKleiderschrank().getID();
                    this.setState({
                        kleiderschrankId: kleiderschrankId
                    }, () => {
                        this.loadStyles();
                    });
                }
            }).catch(error => {
                this.setState({
                    error: "Fehler beim Laden des Kleiderschranks"
                });
            });
    }

    loadStyles = () => {
        this.setState({ loadingInProgress: true, error: null });
        KleiderschrankAPI.getAPI()
            .getStyles()
            .then(styles => {
                const filteredStyles = styles.filter(style => {
                    return style.getKleiderschrankId() === this.state.kleiderschrankId;
                });

                this.setState({
                    styles: filteredStyles,
                    loadingInProgress: false
                });
            })
            .catch(error => {
                this.setState({
                    error: error.message,
                    loadingInProgress: false
                });
            });
    };

    handleCreateClick = () => {
        this.setState({ selectedStyle: null, showFormDialog: true });
    };

    handleEditClick = (style) => {
        this.setState({ selectedStyle: style, showFormDialog: true });
    };

    handleDeleteClick = (style) => {
        this.setState({ selectedStyle: style, showDeleteDialog: true });
    };

    handleStyleClick = (style) => {
        this.setState({
            selectedStyle: style,
            showDetailsDialog: true
        });
    };

    handleFormDialogClosed = (updatedStyle) => {
        if (updatedStyle) {
            this.loadStyles();
        }
        this.setState({ showFormDialog: false, selectedStyle: null });
    };

    handleDeleteDialogClosed = (deletedStyle) => {
        if (deletedStyle) {
            this.loadStyles();
        }
        this.setState({ showDeleteDialog: false, selectedStyle: null });
    };


    render() {
        const { styles, selectedStyle, showFormDialog, showDeleteDialog } = this.state;

        return (
            <div>
                <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>Meine Styles</Typography>
                {/* Erklärender Text */}
                <Typography variant="body1" sx={{ mb: 4 }}>
                    Hier kannst du deine Styles verwalten. Füge neue Styles hinzu,
                    ordne ihnen verschiedene Kleidungstypen und Regeln zu und organisiere deinen digitalen Kleiderschrank ganz nach deinen
                    Vorstellungen.
                </Typography>

                <StyleList
                    styles={styles}
                    onEdit={this.handleEditClick}
                    onDelete={this.handleDeleteClick}
                    onStyleClick={this.handleStyleClick}
                    onCreateClick={this.handleCreateClick}
                />

                {showFormDialog && (
                    <StyleForm
                        show={showFormDialog}
                        style={selectedStyle}
                        onClose={this.handleFormDialogClosed}
                        kleiderschrankId={this.state.kleiderschrankId}
                    />
                )}

                {showDeleteDialog && (
                    <StyleDeleteDialog
                        show={showDeleteDialog}
                        style={selectedStyle}
                        onClose={this.handleDeleteDialogClosed}
                    />
                )}
            </div>
        );
    }
}

export default StylesView;