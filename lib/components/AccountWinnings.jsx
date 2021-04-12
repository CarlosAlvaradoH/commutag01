import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { ethers } from 'ethers'
import { isEmpty } from 'lodash'

import { useTranslation } from 'lib/../i18n'
import { isSelfAtom } from 'lib/components/AccountUI'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { useMultiversionPlayerPrizes } from 'lib/hooks/useMultiversionPlayerPrizes'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import IconTarget from 'assets/images/icon-target@2x.png'

export const AccountWinnings = () => {
  const { t } = useTranslation()

  const [isSelf] = useAtom(isSelfAtom)

  const { usersAddress } = useContext(AuthControllerContext)

  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress

  const { data: prizesWon } = useMultiversionPlayerPrizes(address)

  let awardedControlledTokens = prizesWon?.awardedControlledTokens || []

  const awarded = {}
  awardedControlledTokens.forEach((awardedControlledToken) => {
    const pool = awardedControlledToken.prize.prizePool
    const award = awarded[pool.id] || { total: ethers.BigNumber.from(0) }
    const amount = ethers.BigNumber.from(awardedControlledToken.amount)

    award.ticker = pool.underlyingCollateralSymbol
    award.decimals = pool.underlyingCollateralDecimals
    award.total = award.total.gt(0) ? award.total.add(amount) : amount

    awarded[pool.id] = award
  })

  const awardKeys = !isEmpty(awarded) ? Object.keys(awarded) : []

  // TODO: We should calculate all of the ERC20s someone won, their value on the day it was awarded
  // as well as the interest prizes!

  return (
    <>
      <h5 className='font-normal text-accent-2 mt-16 mb-4'>
        {t(isSelf ? 'myWinnings' : 'winnings')}
      </h5>

      <div className='xs:mt-3 bg-accent-grey-4 rounded-lg xs:mx-0 px-2 sm:px-6 py-3'>
        <div className='flex justify-between xs:py-4 pb-0 px-2 xs:px-4'>
          <div className='w-1/2'>
            {/* TODO: Bring back the USD value of all winnings, when they won them and with all external tokens and lootbox tokens */}
            {/* <h6 className='flex items-center font-normal'>{t('allTimeWinnings')}</h6> */}
            {/* <h3> */}
            {/* $<PoolNumber>{displayAmountInEther(total, { precision: 2 })}</PoolNumber> */}
            {/* </h3> */}
            {awardKeys.length === 0 ? (
              <div className='mb-10 font-bold'>
                {t('youHaveNotWonYet')}
                <br />
                {t('keepYourDepositsInThePoolsToWin')}
              </div>
            ) : (
              <table className='table-fixed text-xxs xs:text-base sm:text-xl w-full'>
                <tbody>
                  {awardKeys.map((awardKey) => {
                    const award = awarded[awardKey]

                    return (
                      <tr key={`award-winnings-row-${awardKey}`}>
                        <td className='px-2 sm:px-3 text-left font-bold'>
                          <span className='mr-2'>
                            <PoolCurrencyIcon sm symbol={award.ticker} />
                          </span>
                          {numberWithCommas(award.total, { decimals: award.decimals })}{' '}
                          {award.ticker}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className='ml-auto'>
            <img src={IconTarget} className='w-24 h-24 mx-auto' />
          </div>
        </div>
      </div>
    </>
  )
}
