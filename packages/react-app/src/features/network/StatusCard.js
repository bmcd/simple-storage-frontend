import { Container } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import { useSelector } from 'react-redux'
import { selectContract } from '../contract/contractSlice'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { selectNetwork } from './networkSlice'
import { getTransactionLink } from '../../utils/eth_utils'

export default function StatusCard() {
  const { pendingTx } = useSelector(selectContract)
  const { chainId } = useSelector(selectNetwork)

  const action = getTransactionLink(chainId, pendingTx, "View in Etherscan");

  return <div>
    <Paper>
      <Container>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={pendingTx && pendingTx !== 'SENDING'}>
          <SnackbarContent
            action={action}
            message={`Waiting for transaction to complete: ${pendingTx}`}/>
        </Snackbar>
      </Container>
    </Paper>
  </div>
}
