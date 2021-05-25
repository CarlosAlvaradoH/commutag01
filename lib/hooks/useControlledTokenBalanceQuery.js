import { useQuery } from 'react-query'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { getControlledTokenBalancesData } from 'lib/fetchers/getControlledTokenBalancesData'
import { getSubgraphClientFromChainIdAndVersion } from 'lib/utils/getSubgraphClients'

export function useControlledTokenBalanceQuery(pool, page, skip, blockNumber = -1) {
  let graphQLClient
  graphQLClient = getSubgraphClientFromChainIdAndVersion(
    pool.chainId,
    pool.contract.subgraphVersion
  )

  const ticketAddress = pool.tokens.ticket.address

  const refetchInterval = blockNumber === -1 ? MAINNET_POLLING_INTERVAL : false

  return useQuery(
    [QUERY_KEYS.controlledTokenBalancesQuery, graphQLClient?.url, ticketAddress, blockNumber, page],
    async () => {
      return getControlledTokenBalancesData(graphQLClient, ticketAddress, blockNumber, skip)
    },
    {
      enabled: Boolean(graphQLClient?.url && ticketAddress && blockNumber && page),
      refetchInterval,
      keepPreviousData: true
    }
  )
}
