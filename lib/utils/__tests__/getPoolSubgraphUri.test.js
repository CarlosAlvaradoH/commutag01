import { getPoolSubgraphUri } from '../getPoolSubgraphUri'

describe('getPoolSubgraphUri', () => {
  describe('latest version', () => {
    it('returns the staging subgraph URI for the latest version', () => {
      const chainId = 4
      const blockNumber = -1

      expect(
        getPoolSubgraphUri(chainId, blockNumber)
      ).toEqual('https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-staging-v3_0_1')
    })

    it('returns the subgraph URI for the latest version', () => {
      const chainId = 4
      const blockNumber = -1

      expect(
        getPoolSubgraphUri(chainId, blockNumber, 'production')
      ).toEqual('https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_0_1')
    })
  })



  describe('v3.0.1', () => {
    it('returns accurate URI for rinkeby staging', () => {
      const chainId = 4
      const blockNumber = 7400000

      expect(
        getPoolSubgraphUri(chainId, blockNumber)
      ).toEqual('https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-staging-v3_0_1')
    })

    it('returns accurate URI for rinkeby v3.0.1 prod', () => {
      const chainId = 4
      const blockNumber = 7400000

      expect(
        getPoolSubgraphUri(chainId, blockNumber, 'production')
      ).toEqual('https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_0_1')
    })
  })
  


  describe('v3.1.0', () => {
    it('returns accurate URI for rinkeby staging', () => {
      const chainId = 4
      const blockNumber = 1345989877

      expect(
        getPoolSubgraphUri(chainId, blockNumber)
      ).toEqual('https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-staging-v3_1_0')
    })

    it('returns accurate URI for rinkeby prod', () => {
      const chainId = 4
      const blockNumber = 1345989877

      expect(
        getPoolSubgraphUri(chainId, blockNumber, 'production')
      ).toEqual('https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_1_0')
    })
  })
})
