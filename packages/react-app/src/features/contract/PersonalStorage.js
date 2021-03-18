import React, { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { selectNetwork } from '../network/networkSlice'
import {
  findAddress, refreshAddressValue,
  selectContract,
  setNewAddressValue,
  setPersonalError,
} from './contractSlice'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import { Refresh } from '@material-ui/icons'
import Container from '@material-ui/core/Container'
import RecentValues from './RecentValues'

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

export default function SimpleStorage () {

  const classes = useStyles()
  const dispatch = useDispatch()
  const network = useSelector(selectNetwork)
  const { connected, personalError, pendingTx, addressValue, address } = useSelector(selectContract)

  const [addressToFind, setAddressToFind] = useState(network.selectedAddress)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if(network.selectedAddress) {
      dispatch(findAddress(network.selectedAddress))
    }
  }, [network])

  if(!connected) {
    return <div>
      <Paper className={classes.container}>
        <Typography variant="h6" className={classes.title}>
          Could not find contract. Please make sure you are connected to the right network.
        </Typography>
      </Paper>
    </div>
  }

  return <div>
    <Paper className={classes.container}>
      <IconButton style={{ float: 'right'}} onClick={() => dispatch(refreshAddressValue())}>
        <Refresh />
      </IconButton>
      <Typography variant="h6" className={classes.title}>
        Personal Storage
      </Typography>
      <Container className={classes.body}>
        <div className={classes.row}>
          <TextField
            className={classes.stretch}
            label="Address"
            value={addressToFind}
            onChange={(event) => setAddressToFind(event.target.value)}/>
          <Button
            className={classes.button}
            variant="contained"
            disableElevation
            onClick={() => {
              try {
                dispatch(findAddress(addressToFind))
              } catch (e) {
                console.error(e)
              }
            }}>
            Find
          </Button>
        </div>
      </Container>
      {address && <Container className={classes.body}>
        <div className={classes.row}>
          <Typography className={classes.stretch}>Address:</Typography>
          <Typography>{address}</Typography>
        </div>
        <div className={classes.row}>
          <Typography className={classes.stretch}>Current Value:</Typography>
          <Typography variant={'h6'}>{addressValue}</Typography>
        </div>
        <div className={classes.row}>
          <TextField
            className={classes.stretch}
            label="Set New Value"
            type="number"
            value={inputValue}
            error={personalError}
            helperText={personalError}
            onChange={(event) => setInputValue(event.target.value)}/>
          <Button
            className={classes.button}
            variant="contained"
            disableElevation
            disabled={!!pendingTx}
            onClick={() => {
              try {
                if(address !== network.selectedAddress) {
                  dispatch(setPersonalError('Only the owner of an address can set its value.'))
                  return
                }
                dispatch(setNewAddressValue(BigNumber.from(inputValue)))
                dispatch(setPersonalError(undefined))
              } catch (e) {
                console.error(e)
                dispatch(setPersonalError('Input must be an integer'))
              }
            }}>
            {pendingTx ? 'Waiting...' : 'Set'}
          </Button>
        </div>
      </Container>
      }
    </Paper>
  </div>
}

