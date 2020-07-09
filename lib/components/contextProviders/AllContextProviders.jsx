import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { AuthControllerContextProvider } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContextProvider } from 'lib/components/contextProviders/PoolDataContextProvider'

const MagicContextProviderDynamic = dynamic(() =>
  import('lib/components/contextProviders/MagicContextProvider').then(mod => mod.MagicContextProvider),
  { ssr: false }
)

const WalletContextProviderDynamic = dynamic(() =>
  import('lib/components/contextProviders/WalletContextProvider').then(mod => mod.WalletContextProvider),
  { ssr: false }
)

export const AllContextProviders = (props) => {
  const { children } = props

  const router = useRouter()
  
  return <MagicContextProviderDynamic>
    <WalletContextProviderDynamic
      postDisconnectCallback={() => {
      }}
      postConnectCallback={async () => {
        router.push(
          `${router.pathname}`,
          `${router.asPath}`,
          {
            shallow: true
          }
        )
      }}
    >
      <AuthControllerContextProvider>
        <PoolDataContextProvider>
          {children}
        </PoolDataContextProvider>
      </AuthControllerContextProvider>
    </WalletContextProviderDynamic>
  </MagicContextProviderDynamic>
}