import React, { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { selectNetwork } from '../network/networkSlice'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import { Refresh } from '@material-ui/icons'
import Container from '@material-ui/core/Container'
import { authorizeStorageTokens, refreshToken, selectToken } from './tokenSlice'

const useStyles = makeStyles({
  container: {
    marginTop: 12,
  },
  title: {
    padding: 12,
  },
  body: {
    padding: 12,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  stretch: {
    flex: 1,
  },
  button: {
    marginLeft: 12,
  }
})

export default function SimpleStorageCoin () {

  const classes = useStyles()
  const dispatch = useDispatch()
  const network = useSelector(selectNetwork)
  const { tokenBalance, storageBalance } = useSelector(selectToken)

  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if(network.selectedAddress) {
      dispatch(refreshToken())
    }
  }, [network])

  if(!network.chainId) {
    return <div>
      <Paper className={classes.container}>
        <Typography variant="h6" className={classes.title}>
          Could not find token contract. Please make sure you are connected to the right network.
        </Typography>
      </Paper>
    </div>
  }

  return <div>
    <Paper className={classes.container}>
      <IconButton style={{ float: 'right'}} onClick={() => dispatch(refreshToken())}>
        <Refresh />
      </IconButton>
      <Typography variant="h6" className={classes.title}>
        Simple Storage Coin
      </Typography>
      <Container className={classes.body}>
        <div className={classes.row}>
          <Typography className={classes.stretch}>Current Balance:</Typography>
          <Typography variant={'h6'} style={{paddingRight: 14}}>{tokenBalance}</Typography>
        </div>
        <div className={classes.row}>
          <Typography className={classes.stretch}>Authorized Balance:</Typography>
          <Typography variant={'h6'} style={{paddingRight: 14}}>{storageBalance}</Typography>
        </div>
        <div className={classes.row}>
          <TextField
            className={classes.stretch}
            label="Authorize Tokens"
            type="number"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}/>
          <Button
            className={classes.button}
            variant="contained"
            disableElevation
            onClick={() => {
              try {
                dispatch(authorizeStorageTokens(BigNumber.from(inputValue)))
              } catch (e) {
                console.error(e)
              }
            }}>
            Authorize
          </Button>
        </div>
      </Container>
    </Paper>
  </div>
}

