import Link from '@material-ui/core/Link'
import React from 'react'

const etherscanUrls = {
  1: 'https://etherscan.io',
  3: 'https://ropsten.etherscan.io',
  4: 'https://rinkeby.etherscan.io',
  5: 'https://goerli.etherscan.io',
  42: 'https://kovan.etherscan.io',

}

export function getTransactionLink (chainId, tx, linkText) {
  if(!etherscanUrls[chainId]) {
    return
  }
  return <Link href={`${etherscanUrls[chainId]}/tx/${tx}`}
               color="primary"
               size="small"
               target="_blank"
               rel="noreferrer">
    {linkText}
  </Link>
}

