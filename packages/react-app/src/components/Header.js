import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { NetworkInfo } from '../features/network/NetworkInfo'
import { useSelector } from 'react-redux'
import { selectNetwork } from '../features/network/networkSlice'
import useWeb3Modal from '../hooks/useWeb3Modal'
import { Button } from '@material-ui/core'

const useStyles = makeStyles({
  header: {
    display: 'flex',
    height: 75,
    alignItems: 'center',
    padding: 16,
  },
  home: {
    textDecoration: 'none',
    color: 'inherit',
    marginRight: 16,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    margin: 12,
  },
})

function WalletButton() {
  const [loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const network = useSelector(selectNetwork)
  return (
    <Button
      variant="contained"
      color={network.chainId ? 'default' : 'primary'}
      disableElevation
      onClick={() => {
        if (!network.chainId) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!network.chainId ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  );
}

export function Header () {
  const classes = useStyles()
  return <Paper className={classes.header}>
    <Typography color='primary' variant="h4" component='h1'>
      Simple Storage
    </Typography>
    <Typography style={{ flex: 1 }}/>
    <NetworkInfo />
    <WalletButton />
  </Paper>
}

