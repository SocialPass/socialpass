import {
  createConfig,
  configureChains,
  mainnet,
} from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'

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