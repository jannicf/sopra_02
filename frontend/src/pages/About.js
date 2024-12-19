import React from 'react'
import { Paper, Typography, Link } from '@mui/material';

/**
 * Die About-Seite unseres Teams
 */
function About() {

  return (
    <Paper elevation={0} sx={{ width: '100%', marginTop: 2, marginBottom: 2, padding: 1 }}>
      <div sx={{ margin: 1 }}>
        <Typography variant='h6'>
          Mein digitaler Kleiderschrank | Software-Praktikum im Wintersemester 24/25
        </Typography>
        <br />
        <Typography>
          Team 02:
          <Link href="https://github.com/Boris147">Boris Burkert</Link> |
          <Link href="https://github.com/jannicfriese">Jannic Friese</Link> |
          <Link href="https://github.com/J0seef">Josef Stuby</Link> |
          <Link href="https://github.com/LucasUrban-WI7">Lucas Urban</Link> |
          <Link href="https://github.com/Xiao1309">Xiaoping Wu</Link> |
          <Link href="https://github.com/yasinyasar017">Yasin Yasar</Link> |
        </Typography>
        <br />
      </div>
    </Paper>
  )
}

export default About;