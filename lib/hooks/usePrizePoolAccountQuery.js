import { useContext } from 'react'
import { useQuery } from 'react-query'

import {
  MAINNET_POLLING_INTERVAL,
  QUERY_KEYS
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getPrizePoolAccountData } from 'lib/fetchers/getPrizePoolAccountData'

export function usePrizePoolAccountQuery(pool, playerAddress, blockNumber = -1, error = null) {
  const { chainId, pauseQueries } = useContext(AuthControllerContext)
  
  const poolAddress = pool?.id?.toLowerCase()

  const enabled = !pauseQueries && chainId && poolAddress && playerAddress && blockNumber && !error

  const refetchInterval = (blockNumber === -1) ?
    MAINNET_POLLING_INTERVAL :
    false

  return useQuery(
    [QUERY_KEYS.prizePoolAccountQuery, chainId, poolAddress, playerAddress, blockNumber],
    async () => { return getPrizePoolAccountData(chainId, poolAddress, playerAddress, blockNumber) },
    { 
      enabled,
      refetchInterval
    }
  )
}