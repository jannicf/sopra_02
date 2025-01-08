import React, { Component } from 'react';
import { Paper, Typography, Grid, Box, Link, Chip, Tooltip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';

class Footer extends Component {
  render() {
    const { user } = this.props;
    if (!user) return null;

    const groupMembers = [
      'Boris Burkert',
      'Jannic Friese',
      'Josef Stuby',
      'Lucas Urban',
      'Xiaoping Wu',
      'Yasin Yasar'
    ];

    return (
      <Box sx={{ pb: '48px' }}>
        <Paper
          variant="outlined"
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'background.paper',
            py: 1
          }}
        >
          <Grid container sx={{ px: 3 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" color="primary">
                  SoPra
                </Typography>
                <Chip
                  label="WiSe 2024/25"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ height: '20px' }}
                />
                <Tooltip title={groupMembers.join(', ')} placement="top">
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    Gruppe 02
                  </Typography>
                </Tooltip>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { md: 'flex-end' }, alignItems: 'center' }}>
                <Link
                  component={RouterLink}
                  to="/about"
                  color="primary"
                  underline="hover"
                  sx={{ typography: 'body2' }}
                >
                  Über uns
                </Link>
                <Link
                  href="https://www.hdm-stuttgart.de"
                  color="primary"
                  underline="hover"
                  target="_blank"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, typography: 'body2' }}
                >
                  <SchoolIcon sx={{ fontSize: 16 }} />
                  HdM Stuttgart
                </Link>
                <Link
                  href="https://moodle.hdm-stuttgart.de/course/view.php?id=808"
                  color="primary"
                  underline="hover"
                  target="_blank"
                  sx={{ typography: 'body2' }}
                >
                  Moodle
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  }
}

export default Footer;