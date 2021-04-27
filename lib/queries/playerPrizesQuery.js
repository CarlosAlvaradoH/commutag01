import gql from 'graphql-tag'

import { prizeFragment } from 'lib/fragments/prizeFragment'

export const playerPrizesQuery = () => {
  return gql`
    query playerPrizesQuery($playerAddress: String!) {
      awardedControlledTokens(where: { winner: $playerAddress }) {
        amount
        token {
          symbol
          decimals
          id
        }
        prize {
          id
          prizePool {
            underlyingCollateralToken
          }
        }
      }

      awardedExternalErc20Tokens(where: { winner: $playerAddress }) {
        id
        address
        name
        symbol
        decimals
        balanceAwarded

        prize {
          id
          prizePool {
            id
            underlyingCollateralDecimals
          }
        }
      }

      awardedExternalErc721Nfts(where: { winner: $playerAddress }) {
        id
        address
        tokenIds

        prize {
          ...prizeFragment

          prizePool {
            id
            underlyingCollateralDecimals
          }
        }
      }
    }
    ${prizeFragment}
  `
}
