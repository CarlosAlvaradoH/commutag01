import { request } from 'graphql-request'

import { POOLTOGETHER_SUBGRAPH_URIS } from 'lib/constants'
import { prizePoolsQuery } from 'lib/queries/prizePoolsQuery'

export const getPoolsData = async (chainId, poolAddresses, blockNumber) => {
  const variables = {
    poolAddresses,
  }

  const query = prizePoolsQuery(blockNumber)

  // https://thegraph.com/explorer/subgraph/pooltogether/rinkeby-v3
  let data
  try {
    data = await request(POOLTOGETHER_SUBGRAPH_URIS[chainId], query, variables)

    // marshall 

  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
  }

  return data?.prizePools
}
