import React from 'react'
import classnames from 'classnames'

import { useTranslation } from 'lib/../i18n'
import { NewPrizeCountdownInWords } from 'lib/components/NewPrizeCountdownInWords'
import { useCurrentPool } from 'lib/hooks/usePools'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import PrizeIllustration from 'assets/images/prize-illustration-new@2x.png'
import LootBoxIllustration from 'assets/images/lootbox-closed-halo@2x.png'
import { PoolNumber } from 'lib/components/PoolNumber'
import { Card, CardDetailsList } from 'lib/components/Card'

export const UpcomingPrizeBreakdownCard = (props) => {
  const { t } = useTranslation()

  const { pool } = props

  const computedLootBoxAddress = pool.lootBoxes?.[0].address
  const symbol = pool.tokens.underlyingToken.symbol
  const { numberOfWinners, splitExternalErc20Awards } = pool.config
  const numberOfWinnersMinusOne = numberOfWinners ? parseInt(numberOfWinners, 10) - 1 : 0
  const totalValuePerWinnerUsd = numberWithCommas(pool.prize.totalValuePerWinnerUsd)
  const totalExternalAwardsUsd = numberWithCommas(pool.prize.totalExternalAwardsUsd)
  const totalInternalAwardsUsd = numberWithCommas(pool.prize.totalInternalAwardsUsd)
  const externalAwardsGreaterThanZero = !pool.prize.totalExternalAwardsUsdScaled.isZero()

  const hasTicketPrize = Boolean(parseFloat(pool.prize.totalValuePerWinnerUsd))

  let strategyDescriptionBasic
  if (splitExternalErc20Awards) {
    strategyDescriptionBasic = t('prizeSplitEvenlyBetweenAllWinners', {
      numberOfWinners: numberOfWinners
    })
  } else if (hasTicketPrize) {
    strategyDescriptionBasic = t('prizeInterestSplitBetweenNWinners', {
      numberOfWinnersMinusOne
    })
  }

  if (pool?.numberOfWinners <= 1) {
    strategyDescriptionBasic = t('prizeGivenToASingleWinner')
  }

  return (
    <Card>
      <h3 className='text-center'>
        {symbol} {t('prize')} #{pool.prize.currentPrizeId}
      </h3>

      <p className='mx-auto text-accent-1 text-center'>{strategyDescriptionBasic}</p>

      <div className='flex flex-col xs:flex-row'>
        {computedLootBoxAddress && <div className='hidden sm:block sm:w-2/12'>&nbsp;</div>}

        {hasTicketPrize && (
          <div
            className={classnames(
              'flex flex-col items-center justify-center text-center w-full h-56 xs:h-64',
              {
                'xs:w-5/12': computedLootBoxAddress
              }
            )}
          >
            <img src={PrizeIllustration} className='w-40 mx-auto' />
            <div>
              <h3>{`$${totalInternalAwardsUsd}`}</h3>
            </div>
          </div>
        )}

        {externalAwardsGreaterThanZero && (
          <>
            <div className='w-full xs:w-2/12 text-center -mt-2 xs:mt-24 mb-2 xs:mb-0 xs:pt-3 text-5xl font-bold leading-none'>
              {` + `}
            </div>

            <div className='flex flex-col items-center justify-center text-center w-full xs:w-5/12 h-56 xs:h-64'>
              <img src={LootBoxIllustration} className='w-40 mx-auto -mt-8' />
              <div
                className='relative'
                style={{
                  top: 3
                }}
              >
                <h3>{externalAwardsGreaterThanZero && `$${totalExternalAwardsUsd}`}</h3>
              </div>
            </div>

            <div className='hidden sm:block sm:w-2/12'>&nbsp;</div>
          </>
        )}
      </div>

      {hasTicketPrize && numberOfWinners > 1 && (
        <CardDetailsList>
          <GrandPrize
            splitExternalErc20Awards={splitExternalErc20Awards}
            externalPrizeExists={externalAwardsGreaterThanZero}
            externalPrize={totalExternalAwardsUsd}
            prize={totalValuePerWinnerUsd}
          />
          {[...Array(numberOfWinnersMinusOne).keys()].map((index) => (
            <RunnerUp key={`runner-up-row-${index}`} prize={totalValuePerWinnerUsd} />
          ))}
        </CardDetailsList>
      )}
    </Card>
  )
}

const GrandPrize = (props) => {
  const { t } = useTranslation()

  const { splitExternalErc20Awards, externalPrizeExists, externalPrize, prize } = props

  return (
    <li className='flex justify-between mb-2'>
      <span className='text-accent-1'>{t('grandPrize')}</span>
      <span className='flex flex-col xs:flex-row text-right xs:text-left'>
        {!splitExternalErc20Awards && externalPrizeExists && (
          <span>
            {externalPrizeExists && (
              <span>
                $<PoolNumber>{externalPrize}</PoolNumber>
              </span>
            )}
            <span className='text-accent-1'>{t('lootBox')}</span>
            {prize && externalPrizeExists && <span className='mx-1'>+</span>}
          </span>
        )}
        <span>
          $<PoolNumber>{prize}</PoolNumber>
        </span>
      </span>
    </li>
  )
}

const RunnerUp = (props) => {
  const { t } = useTranslation()
  const { prize } = props

  return (
    <li className='flex justify-between mb-2 last:mb-0 '>
      <span className='text-accent-1'>{t('runnerUp')}</span>
      <span>
        {/* TODO: Display "winner" if historic */}$<PoolNumber>{prize}</PoolNumber>
      </span>
    </li>
  )
}
