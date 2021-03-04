import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'

import { Body, Button, Header } from './components'
import useWeb3Modal from './hooks/useWeb3Modal'

import GET_TRANSFERS from './graphql/subgraph'
import SimpleStorage from './components/SimpleStorage'

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  );
}

function NetworkInfo({ provider }) {
  const [network, setNetwork] = useState()

  useEffect(() => {
    if(!provider) {
      return;
    }
    provider.getNetwork().then((network) => setNetwork(network))

  }, [provider])

  if(!provider || !network) {
    return <div>Not connected</div>
  }
  return <div>
    <div>Connected{provider.provider.isMetaMask && ' (via MetaMask)'}: {network.name === 'unknown' ? 'Unknown Network' : network.name} ({network.chainId})</div>
    <div>Address: {provider.provider.selectedAddress}</div>
  </div>
}

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);

  return (
    <div>
      <Header>
        <NetworkInfo provider={provider} />
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body>
        {provider && <SimpleStorage provider={provider} />}
      </Body>
    </div>
  );
}

export default App;
