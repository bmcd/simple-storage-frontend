import { useSelector } from 'react-redux'
import React from 'react'
import { selectNetwork } from './networkSlice'
import { makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  container: {
    width: 320,
    margin: 12,
  },
  line: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
})
export function NetworkInfo () {
  const classes = useStyles()
  const { name, chainId, walletType, selectedAddress } = useSelector(selectNetwork)

  if (!chainId) {
    return <div></div>
  }
  return <div className={classes.container}>
    <Typography className={classes.line}>Connected{walletType && ` (via ${walletType})`}: {name === 'unknown' ? 'Unknown Network' : name} ({chainId})</Typography>
    <Typography className={classes.line}>Address: {selectedAddress}</Typography>
  </div>
}
