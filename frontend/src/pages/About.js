import React, {Component} from 'react'
import { Paper, Typography, Link, List, ListItem } from '@mui/material';

/**
 * Die About-Seite unseres Teams
 */
class About extends Component {
    render() {
        return (
            <Paper elevation={0} sx={{marginTop: 2, marginBottom: 2, padding: 1}}>
                <Typography variant='h6' align='center'>
                    Mein digitaler Kleiderschrank | Software-Praktikum im Wintersemester 24/25
                </Typography>
                <Typography variant='h6' fontWeight='bold' align='center' sx={{marginTop: 2, marginBottom: 1}}>
                    Gruppe 02
                </Typography>
                <List sx={{
                    bottom: 0,
                    left: 0,
                    right: 0,
                    marginTop: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <ListItem>
                        <Link href="https://github.com/Boris147">Boris Burkert</Link>
                    </ListItem>
                    <ListItem>
                        <Link href="https://github.com/jannicfriese">Jannic Friese</Link>
                    </ListItem>
                    <ListItem>
                        <Link href="https://github.com/J0seef">Josef Stuby</Link>
                    </ListItem>
                    <ListItem>
                        <Link href="https://github.com/LucasUrban-WI7">Lucas Urban</Link>
                    </ListItem>
                    <ListItem>
                        <Link href="https://github.com/Xiao1309">Xiaoping Wu</Link>
                    </ListItem>
                    <ListItem>
                        <Link href="https://github.com/yasinyasar017">Yasin Yasar</Link>
                    </ListItem>
                </List>
            </Paper>
        )
    }
}

export default About;