import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { useSelector } from 'react-redux'
import { selectNetwork } from './features/network/networkSlice'
import SimpleStorage from './features/contract/SimpleStorage'
import { Header } from './components/Header'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import StatusCard from './features/network/StatusCard'
import PersonalStorage from './features/contract/PersonalStorage'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles({
  container: {
    margin: 12,
  },
  title: {
    padding: 12,
  },
  gridItem: {
    padding: 12,
  },
})

function NotConnected() {
  const classes = useStyles()
  return <div>
    <Paper className={classes.container}>
      <Typography variant="h6" className={classes.title}>
        Connect to Metamask or a similar wallet to get started.
      </Typography>
    </Paper>
  </div>
}

function App() {
  const classes = useStyles()
  const network = useSelector(selectNetwork)

  return (
    <div>
      <Header />
      {!network.chainId && <NotConnected />}
      {network.chainId && <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="flex-start"
      >
        <Grid className={classes.gridItem} item xs={12} sm={10} md={6}>
          <PersonalStorage/>
        </Grid>
        <Grid className={classes.gridItem} item xs={12} sm={10} md={6}>
          <SimpleStorage/>
        </Grid>
      </Grid>
      }
      <StatusCard />
    </div>
  );
}

export default App;
