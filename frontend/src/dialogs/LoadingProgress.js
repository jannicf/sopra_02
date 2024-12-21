import React, { Component } from 'react';
import { LinearProgress } from '@mui/material';

/**
 * Zeigt einen Ladefortschritt wenn show true ist.
 */
class LoadingProgress extends Component {

  /** Renders the component */
  render() {
    const { show } = this.props;

    return (
      show ?
        <div >
          <LinearProgress sx={{width: '100%', marginTop: 2}} color='secondary' />
        </div>
        : null
    );
  }
}

export default LoadingProgress;
