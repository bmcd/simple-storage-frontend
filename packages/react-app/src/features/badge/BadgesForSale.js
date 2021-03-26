import { gql } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'
import { selectNetwork } from '../network/networkSlice'
import { useQuery } from '@apollo/react-hooks'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { getBadgeUri } from '../../api/provider'
import { Button } from '@material-ui/core'
import { cancelTrade, executeTrade } from './badgeSlice'
import { BigNumber } from '@ethersproject/bignumber'
import TextField from '@material-ui/core/TextField'
import {
  authorizeMarketplaceTokens,
  selectToken
} from '../token/tokenSlice'

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
  table: {}
})

const GET_TRADES = gql`
{
  trades(where: { status: "Open" }, orderBy: ad, orderDirection: desc) {
    ad
    poster
    tokenId
    price
    status
  }
}
`

function ItemView ({ trade }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { selectedAddress='' } = useSelector(selectNetwork)
  const [uri, setUri] = useState()
  const isPoster = trade.poster.toUpperCase() === selectedAddress.toUpperCase()
  useEffect(() => {
    getBadgeUri(trade.tokenId)
      .then((uri) => {
        setUri(uri)
      })

  }, [trade])
  return (
    <TableRow key={'trade-' + trade.ad}>
      <TableCell>
        { uri && <img
          src={uri}
          key={'img-' + trade.ad} />}
      </TableCell>
      <TableCell>{trade.tokenId}</TableCell>
      <TableCell>{trade.price}</TableCell>
      <TableCell>
        <Button
          className={classes.button}
          variant="contained"
          disableElevation
          onClick={() => {
            try {
              if(isPoster) {
                dispatch(cancelTrade(trade))
              } else {

                dispatch(executeTrade(trade))
              }
            } catch (e) {
              console.error(e)
            }
          }}>
          {isPoster ? 'Cancel' : 'Buy'}
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default function BadgesForSale () {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState('')
  const { marketplaceBalance } = useSelector(selectToken)
  const { loading, data } = useQuery(GET_TRADES)

  if (loading) return <p>Loading ...</p>

  return (
    <Paper className={classes.container}>
      <Typography variant="h6" className={classes.title}>Badges For Sale</Typography>
      <Container className={classes.body}>
        <div className={classes.row}>
          <Typography className={classes.stretch}>Marketplace Balance:</Typography>
          <Typography variant={'h6'} style={{paddingRight: 14}}>{marketplaceBalance}</Typography>
        </div>
        <div className={classes.row}>
          <TextField
            className={classes.stretch}
            label="Authorize Tokens for Market"
            type="number"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}/>
          <Button
            className={classes.button}
            variant="contained"
            disableElevation
            onClick={() => {
              try {
                dispatch(authorizeMarketplaceTokens(BigNumber.from(inputValue)))
              } catch (e) {
                console.error(e)
              }
            }}>
            Authorize
          </Button>
        </div>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Badge</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.trades.map((trade) => <ItemView trade={trade}/>)}
          </TableBody>
        </Table>
      </Container>
    </Paper>
  )
}

