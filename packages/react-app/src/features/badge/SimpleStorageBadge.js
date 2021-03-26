import React, { useEffect, useState } from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { selectNetwork } from '../network/networkSlice'
import { Add, Refresh } from '@material-ui/icons'
import Container from '@material-ui/core/Container'
import {
  approveBadge,
  chooseBadge,
  listBadge,
  mintBadge,
  refreshBadges,
  selectBadge,
} from './badgeSlice'
import { Button } from '@material-ui/core'
import { selectContract } from '../contract/contractSlice'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { BigNumber } from '@ethersproject/bignumber'
import TextField from '@material-ui/core/TextField'

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
  },
  badge: {
    marginLeft: 8,
    cursor: 'pointer',
  },
})

export default function SimpleStorageBadge () {

  const classes = useStyles()
  const dispatch = useDispatch()
  const network = useSelector(selectNetwork)
  const { price } = useSelector(selectContract)
  const { connected, badges, selectedBadge = {}, approved } = useSelector(selectBadge)

  const [open, setOpen] = useState(false)
  const [salePrice, setSalePrice] = useState(5000)
  const [imageUri, setImageUri] = useState(`https://static-cdn.jtvnw.net/emoticons/v1/${Math.floor(Math.random() * 10000)}/1.0`)

  useEffect(() => {
    if (network.selectedAddress) {
      dispatch(refreshBadges())
    }
  }, [network])

  if (!connected) {
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
      <Typography variant="h6" className={classes.title}>
        My Badges
        {badges.map((badge) => {
          return <img
            onClick={() => dispatch(chooseBadge(badge))}
            style={{ border: (badge.id === selectedBadge.id ? '1px solid black' : 'none') }}
            src={badge.tokenUri}
            className={classes.badge}
            key={badge.tokenUri}/>
        })}
        <Add className={classes.badge} onClick={() => setOpen(true)}/>
      </Typography>
      {selectedBadge.id && (
        <Container className={classes.body}>
          <div className={classes.row}>
            <Typography className={classes.stretch}>Badge:</Typography>
            <Typography variant={'h6'}>
              <img
                src={selectedBadge.tokenUri}
                className={classes.badge}
                key={selectedBadge.tokenUri + 'selected'}/>
            </Typography>
          </div>
          <div className={classes.row}>
            <Typography className={classes.stretch}>ID:</Typography>
            <Typography>{selectedBadge.id}</Typography>
          </div>
          <div className={classes.row}>
            <Typography className={classes.stretch}>URI:</Typography>
            <Typography>{selectedBadge.tokenUri}</Typography>
          </div>
          <div className={classes.row}>
            <Typography className={classes.stretch}>Approved for Sale:</Typography>
            {approved ? <Typography>'Yes'</Typography> : <Button
              className={classes.button}
              variant="contained"
              disableElevation
              onClick={() => {
                try {
                  dispatch(approveBadge(selectedBadge))
                } catch (e) {
                  console.error(e)
                }
              }}>
              Approve
            </Button>}
          </div>
          {approved && <div className={classes.row}>
            <TextField
              className={classes.stretch}
              label="List for SSC"
              type="number"
              value={salePrice}
              onChange={(event) => setSalePrice(event.target.value)}/>
            <Button
              className={classes.button}
              variant="contained"
              disableElevation
              onClick={() => {
                try {
                  dispatch(listBadge(selectedBadge, BigNumber.from(salePrice)))
                } catch (e) {
                  console.error(e)
                }
              }}>
              List
            </Button>
          </div>
          }
        </Container>
      )}
    </Paper>
    <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Mint Badge</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Mint the badge below for {price} SSC.
        </DialogContentText>
        <Refresh className={classes.badge} style={{ float: 'right' }} onClick={() => {
          setImageUri(`https://static-cdn.jtvnw.net/emoticons/v1/${Math.floor(Math.random() * 10000)}/1.0`)
          dispatch(refreshBadges())
        }}/>
        <img style={{ float: 'right' }} src={imageUri} className={classes.badge}/>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Close
        </Button>
        <Button
          color="primary"
          onClick={() => {
            try {
              dispatch(mintBadge(imageUri))
              setOpen(false)
            } catch (e) {
              console.error(e)
            }
          }}>
          Mint
        </Button>
      </DialogActions>
    </Dialog>
  </div>
}

