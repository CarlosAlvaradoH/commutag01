import React from 'react'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { Card } from 'lib/components/Card'
import { IndexUILoader } from 'lib/components/loaders/IndexUILoader'
import { PoolNumber } from 'lib/components/PoolNumber'
import { TicketsSoldGraph } from 'lib/components/TicketsSoldGraph'
import { Tooltip } from 'lib/components/Tooltip'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const PoolCharts = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  const loading =
    !pool.ticketToken || !pool.sponsorshipToken || !pool.reserveRegistry || !pool.reserveTotalSupply

  if (loading) {
    return (
      <Card>
        <IndexUILoader />
      </Card>
    )
  }

  return (
    <>
      <Card>
        <div className='flex justify-between'>{/* <h3>{t('poolsStats')}</h3> */}</div>
        <DepositsAndPrizesCharts pool={pool} />
      </Card>
    </>
  )
}

const DepositsAndPrizesCharts = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  const decimals = pool.underlyingCollateralDecimals
  const totalDeposits = ethers.BigNumber.from(pool.ticketToken.totalSupply)
  const totalDepositsFormatted = ethers.utils.formatUnits(totalDeposits, decimals)
  const tokenSymbol = pool.underlyingCollateralSymbol

  return (
    <div className='text-inverse p-4 bg-card h-full sm:h-auto rounded-none sm:rounded-xl mx-auto flex flex-col sm:flex-row'>
      <div className='mb-4 w-full'>
        <div className='flex'>
          <h5>{t('historicDeposits')}</h5>
          <Tooltip
            id={'historic-deposits'}
            className='ml-2 my-auto text-accent-1'
            tip={t('historicDepositsInfo')}
          />
        </div>
        <span>{t('currentDeposits')}:</span>
        <span className='ml-4'>
          <PoolNumber>{numberWithCommas(totalDepositsFormatted)}</PoolNumber>
          <span>{tokenSymbol}</span>
        </span>
        <TicketsSoldGraph pool={pool} />
      </div>

      {/* <div className='mb-8'>
        <div className='flex'>
          <h5>{t('historicPrizes')}</h5>
          <Tooltip
            id={'historic-prizes'}
            className='ml-2 my-auto text-accent-1'
            tip={t('historicPrizesInfo')}
          />
        </div>
        <span>{t('currentPrize')}:</span>
        <span className='ml-4'>
          <PoolNumber>{numberWithCommas(currentPrizeFormatted)}</PoolNumber>
          <span>{tokenSymbol}</span>
        </span>
        <PrizeValueGraph pool={pool} renderEmptyState={() => <ChartEmptyState />} />
      </div> */}
    </div>
  )
}

const ChartEmptyState = () => {
  const { t } = useTranslation()
  return <p className='mt-8 text-center text-accent-1 opacity-40'>{t('notEnoughData')}</p>
}