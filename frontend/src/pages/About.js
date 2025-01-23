import React from 'react'
import {Paper, Typography, Box, Link} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

function About() {
  return (
    <Paper elevation={0} sx={{ marginTop: 2, marginBottom: 2, padding: 4 }}>
      <Typography variant='h6' align='center'>
        MEIN DIGITALER KLEIDERSCHRANK | Software-Praktikum im Wintersemester 24/25
      </Typography>

      <Typography variant='body1' align='center' sx={{ marginTop: 2, marginBottom: 2 }}>
        Diese Anwendung wurde im Rahmen des Moduls Software-Praktikum im 4. Semester des
        Studiengangs Wirtschaftsinformatik und digitale Medien  an der Hochschule der Medien Stuttgart entwickelt.
        Sie ermöglicht Nutzern, ihren physischen Kleiderschrank digital abzubilden und daraus verschiedene Outfits
        zu generieren, die mithilfe von selbst erstellten Constraints bestimmte Regeln befolgen.
      </Typography>

      <Typography variant='h6' fontWeight='bold' align='center' sx={{ marginTop: 2, marginBottom: 1 }}>
        Gruppe 02
      </Typography>

      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 3,
        mt: 4
      }}>
        <Link href="https://github.com/Boris147" sx={{ textDecoration: 'none' }}>
          <Box sx={{
            width: 300,
            p: 2,
            textAlign: 'center',
            borderRadius: 2,
            boxShadow: 2,
            bgcolor: 'primary.main',
            '&:hover': {
              transform: 'translateY(-2px)',
              transition: 'all 0.2s'
            }
          }}>
            <GitHubIcon sx={{ color: 'white' }} fontSize="large" />
            <Typography sx={{ mt: 1, color: 'white' }}>Boris Burkert</Typography>
          </Box>
        </Link>

         <Link href="https://github.com/jannicfriese" sx={{ textDecoration: 'none' }}>
          <Box sx={{
            width: 300,
            p: 2,
            textAlign: 'center',
            borderRadius: 2,
            boxShadow: 2,
            bgcolor: 'primary.main',
            '&:hover': {
              transform: 'translateY(-2px)',
              transition: 'all 0.2s'
            }
          }}>
            <GitHubIcon sx={{ color: 'white' }} fontSize="large" />
            <Typography sx={{ mt: 1, color: 'white' }}>Jannic Friese</Typography>
          </Box>
        </Link>

        <Link href="https://github.com/J0seef" sx={{ textDecoration: 'none' }}>
          <Box sx={{
            width: 300,
            p: 2,
            textAlign: 'center',
            borderRadius: 2,
            boxShadow: 2,
            bgcolor: 'primary.main',
            '&:hover': {
              transform: 'translateY(-2px)',
              transition: 'all 0.2s'
            }
          }}>
            <GitHubIcon sx={{ color: 'white' }} fontSize="large" />
            <Typography sx={{ mt: 1, color: 'white' }}>Josef Stuby</Typography>
          </Box>
        </Link>

        <Link href="https://github.com/LucasUrban-WI7" sx={{ textDecoration: 'none' }}>
          <Box sx={{
            width: 300,
            p: 2,
            textAlign: 'center',
            borderRadius: 2,
            boxShadow: 2,
            bgcolor: 'primary.main',
            '&:hover': {
              transform: 'translateY(-2px)',
              transition: 'all 0.2s'
            }
          }}>
            <GitHubIcon sx={{ color: 'white' }} fontSize="large" />
            <Typography sx={{ mt: 1, color: 'white' }}>Lucas Urban</Typography>
          </Box>
        </Link>

        <Link href="https://github.com/Xiao1309" sx={{ textDecoration: 'none' }}>
          <Box sx={{
            width: 300,
            p: 2,
            textAlign: 'center',
            borderRadius: 2,
            boxShadow: 2,
            bgcolor: 'primary.main',
            '&:hover': {
              transform: 'translateY(-2px)',
              transition: 'all 0.2s'
            }
          }}>
            <GitHubIcon sx={{ color: 'white' }} fontSize="large" />
            <Typography sx={{ mt: 1, color: 'white' }}>Xiaoping Wu</Typography>
          </Box>
        </Link>

        <Link href="https://github.com/yasinyasar017" sx={{ textDecoration: 'none' }}>
          <Box sx={{
            width: 300,
            p: 2,
            textAlign: 'center',
            borderRadius: 2,
            boxShadow: 2,
            bgcolor: 'primary.main',
            '&:hover': {
              transform: 'translateY(-2px)',
              transition: 'all 0.2s'
            }
          }}>
            <GitHubIcon sx={{ color: 'white' }} fontSize="large" />
            <Typography sx={{ mt: 1, color: 'white' }}>Yasin Yasar</Typography>
          </Box>
        </Link>
      </Box>
    </Paper>
  );
}

export default About;