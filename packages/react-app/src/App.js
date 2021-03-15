import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import GET_TRANSFERS from './graphql/subgraph'
import { useSelector } from 'react-redux'
import { selectNetwork } from './features/network/networkSlice'
import SimpleStorage from './features/contract/SimpleStorage'
import { Header } from './components/Header'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import StatusCard from './features/network/StatusCard'

const useStyles = makeStyles({
  container: {
    marginTop: 24,
  },
  title: {
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
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const network = useSelector(selectNetwork)

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);

  return (
    <div>
      <Header />
      <Container maxWidth="xs">
        {network.chainId ? <SimpleStorage /> : <NotConnected />}
      </Container>
      <StatusCard />
    </div>
  );
}

export default App;
