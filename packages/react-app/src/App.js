import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { Body, Button, Header } from './components'
import useWeb3Modal from './hooks/useWeb3Modal'

import GET_TRANSFERS from './graphql/subgraph'
import SimpleStorage from './components/SimpleStorage'
import { useSelector } from 'react-redux'
import { selectNetwork } from './features/network/networkSlice'
import { NetworkInfo } from './features/network/NetworkInfo'

function WalletButton({ loadWeb3Modal, logoutOfWeb3Modal }) {
  const network = useSelector(selectNetwork)
  return (
    <Button
      onClick={() => {
        if (!network.chainId) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!network.chainId ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  );
}

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const network = useSelector(selectNetwork)

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);

  return (
    <div>
      <Header>
        <NetworkInfo />
        <WalletButton loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body>
        {network.chainId && <SimpleStorage />}
      </Body>
    </div>
  );
}

export default App;
