import { gql } from '@apollo/client'
import { useSelector } from 'react-redux'
import { selectNetwork } from '../network/networkSlice'
import { useQuery } from '@apollo/react-hooks'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { getTransactionLink } from '../../utils/eth_utils'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

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
  table: {
  }
})

const GET_CHANGES = gql`
{
  changes(first: 10, orderBy: block, orderDirection: desc) {
    id
    block
    message
    newVal
    user
  }
}
`;

export default function RecentValues() {
  const classes = useStyles()
  const { chainId } = useSelector(selectNetwork)
  const { loading, error, data } = useQuery(GET_CHANGES, {
    variables: { language: 'english' },
  })
  if (loading) return <p>Loading ...</p>
  const ItemView = (change) => {
    let shortened = `${change.id.substring(0, 10)}...`
    return (
      <TableRow key={change.id}>
        <TableCell>{change.newVal}</TableCell>
        <TableCell>{change.user ? `${change.user.substring(0,10)}...` : 'Global'}</TableCell>
        <TableCell>{change.block}</TableCell>
        <TableCell>{getTransactionLink(chainId, change.id, shortened) || shortened}</TableCell>
      </TableRow>
    )
  }
  console.log('data', data, 'error', error)
  return (
    <Paper className={classes.container}>
      <Typography variant="h6" className={classes.title}>Recent Values {loading &&
      <CircularProgress size={18}/>}</Typography>
      <Container className={classes.body}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Value</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Block</TableCell>
              <TableCell>Transaction</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.changes.map(ItemView)}
          </TableBody>
        </Table>
      </Container>
    </Paper>
  )
}

