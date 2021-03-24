import React, { useEffect, useState } from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { selectNetwork } from '../network/networkSlice'
import IconButton from '@material-ui/core/IconButton'
import { Refresh } from '@material-ui/icons'
import Container from '@material-ui/core/Container'
import { mintBadge, refreshBadges, selectBadge } from './badgeSlice'
import { Button } from '@material-ui/core'
import { selectContract } from '../contract/contractSlice'

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
  },
})

export default function SimpleStorageBadge () {

  const classes = useStyles()
  const dispatch = useDispatch()
  const network = useSelector(selectNetwork)
  const { price } = useSelector(selectContract)
  const { connected, badges } = useSelector(selectBadge)

  const [imageUri, setImageUri] = useState(`https://static-cdn.jtvnw.net/emoticons/v1/${Math.floor(Math.random()* 10000)}/1.0`)

  useEffect(() => {
    if(network.selectedAddress) {
      dispatch(refreshBadges())
    }
  }, [network])

  if(!connected) {
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
      <IconButton style={{ float: 'right'}} onClick={() => {
        setImageUri(`https://static-cdn.jtvnw.net/emoticons/v1/${Math.floor(Math.random()* 10000)}/1.0`)
        dispatch(refreshBadges())
      }}>
        <Refresh />
      </IconButton>
      <Typography variant="h6" className={classes.title}>
        My Badges
        {badges.map((uri) => <img src={uri} className={classes.badge} key={uri} />)}
      </Typography>
      <Container className={classes.body}>
        <div className={classes.row}>
        </div>
        <div className={classes.row}>
          <Typography className={classes.stretch}>Add Badge ({price} SSC):</Typography>
        <img src={imageUri} className={classes.badge} />
        <Button
          className={classes.button}
          variant="contained"
          disableElevation
          onClick={() => {
            try {
              dispatch(mintBadge(imageUri))
            } catch (e) {
              console.error(e)
            }
          }}>
          Mint
        </Button>
        </div>
      </Container>
    </Paper>
  </div>
}

