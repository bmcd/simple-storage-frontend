import { useCallback, useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useDispatch } from 'react-redux'
import { setProvider } from '../api/provider'
import { fetchNetwork, update } from '../features/network/networkSlice'
import Fortmatic from 'fortmatic'

const NETWORK_NAME = 'ropsten'

// Enter a valid infura key here to avoid being rate limited
// You can get a key for free at https://infura.io/register
const INFURA_ID = 'INVALID_INFURA_KEY'

const FORTMATIC_KEY = 'INVALID_FORTMATIC_KEY'

function useWeb3Modal(config = {}) {
  const dispatch = useDispatch()
  const [autoLoaded, setAutoLoaded] = useState(false);
  const { autoLoad = true, infuraId = INFURA_ID, NETWORK = NETWORK_NAME } = config;

  if (INFURA_ID === 'INVALID_INFURA_KEY') {
    console.log('Warning: In order for WalletConnect to work properly, please add an Infura ID to src/hooks/useWeb3Modal.js')
  }
  if (FORTMATIC_KEY === 'INVALID_FORTMATIC_KEY') {
    console.log('Warning: In order for Fortmatic to work properly, please add a fortmatic api key to src/hooks/useWeb3Modal.js')
  }
  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  const web3Modal = new Web3Modal({
    network: NETWORK,
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId,
        },
      },
      fortmatic: {
        package: Fortmatic, // required
        options: {
          key: FORTMATIC_KEY // required
        }
      },
    },
  });

  // Open wallet selection modal.
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    setProvider(new Web3Provider(newProvider));
    dispatch(fetchNetwork())
  }, [web3Modal]);

  const logoutOfWeb3Modal = useCallback(
    async function () {
      dispatch(update({}))
      await web3Modal.clearCachedProvider();
      window.location.reload();
    },
    [web3Modal],
  );

  // If autoLoad is enabled and the the wallet had been loaded before, load it automatically now.
  useEffect(() => {
    if (autoLoad && !autoLoaded && web3Modal.cachedProvider) {
      loadWeb3Modal();
      setAutoLoaded(true);
    }
  }, [autoLoad, autoLoaded, loadWeb3Modal, setAutoLoaded, web3Modal.cachedProvider]);

  return [loadWeb3Modal, logoutOfWeb3Modal];
}

export default useWeb3Modal;
