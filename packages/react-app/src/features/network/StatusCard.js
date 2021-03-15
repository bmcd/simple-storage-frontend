import { Container } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import { useSelector } from 'react-redux'
import { selectContract } from '../contract/contractSlice'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Link from '@material-ui/core/Link'
import { selectNetwork } from './networkSlice'

const etherscanUrls = {
  1: 'https://etherscan.io',
  3: 'https://ropsten.etherscan.io',
  4: 'https://rinkeby.etherscan.io',
  5: 'https://goerli.etherscan.io',
  42: 'https://kovan.etherscan.io',

}
export default function StatusCard() {
  const { pendingTx } = useSelector(selectContract)
  const { chainId } = useSelector(selectNetwork)

  let action
  if(etherscanUrls[chainId]) {
    action = (
      <Link href={`${etherscanUrls[chainId]}/tx/${pendingTx}`}
            color="secondary"
            size="small"
            target="_blank"
            rel="noreferrer">
        View in Etherscan
      </Link>
    );
  }

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
