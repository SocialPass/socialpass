import {
  createConfig,
  configureChains,
  mainnet,
} from '@wagmi/core'
import { getAccount } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import { connect, fetchEnsName } from '@wagmi/core'
import { signMessage } from '@wagmi/core'
import { InjectedConnector } from '@wagmi/core/connectors/injected'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

window.console.log(config);

export async function connectWallet(){
  // Connect wallet
  const result = await connect({
    connector: new InjectedConnector(),
  })
  const account = getAccount();
  console.log(result);
  console.log(account);
  document.getElementById("id_wallet_address").value = account.address;
}

export async function walletSign(message){
  const signature = await signMessage({
    message: 'gm wagmi frens',
  });
  console.log(signature)
  document.getElementById("id_signed_message").value = signature;
}

window.connectWallet = connectWallet;
window.walletSign = walletSign;