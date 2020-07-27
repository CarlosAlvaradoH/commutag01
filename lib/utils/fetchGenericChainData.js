import { batch, contract } from '@pooltogether/etherplex'

// import ERC20Abi from 'ERC20Abi'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PrizeStrategy'

export const fetchGenericChainData = async (
  provider,
  prizeStrategyAddress,
) => {
  // console.log({ poolObj})
  if (
    provider &&
    prizeStrategyAddress
    // sponsorship
  ) {
    try {
      const etherplexPrizeStrategyContract = contract(
        'prizeStrategy',
        PrizeStrategyAbi,
        prizeStrategyAddress
      )
      // const etherplexSponsorshipContract = contract(
      //   'sponsorship',
      //   ERC20Abi,
      //   sponsorship
      // )

      const values = await batch(
        provider,
        etherplexPrizeStrategyContract
          // .isRngRequested() // used to determine if the pool is locked
          .canStartAward()
          .canCompleteAward()
          .prizePeriodRemainingSeconds()
          .estimatePrize()
        // etherplexSponsorshipContract
        //   .name()
        //   .symbol()
        //   .totalSupply(),
      )

      return {
        // isRngRequested: values.prizeStrategy.isRngRequested[0],
        canStartAward: values.prizeStrategy.canStartAward[0],
        canCompleteAward: values.prizeStrategy.canCompleteAward[0],
        estimatePrize: values.prizeStrategy.estimatePrize[0],
        prizePeriodRemainingSeconds: values.prizeStrategy.prizePeriodRemainingSeconds[0],
        // sponsorshipName: values.sponsorship.name,
        // sponsorshipSymbol: values.sponsorship.symbol,
        // sponsorshipTotalSupply: values.sponsorship.totalSupply,
        loading: false,
      }
    } catch (e) {
      console.warn(e.message)
      throw new Error(e)
    }

  }
}