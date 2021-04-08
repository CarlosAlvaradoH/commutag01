import React from 'react'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { DEFAULT_TOKEN_PRECISION, PRIZE_POOL_TYPES, SECONDS_PER_DAY } from 'lib/constants'
import {
  CUSTOM_YIELD_SOURCE_NAMES,
  CUSTOM_YIELD_SOURCE_IMAGES
} from 'lib/constants/customYieldSourceImages'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { PoolNumber } from 'lib/components/PoolNumber'
import { IndexUILoader } from 'lib/components/loaders/IndexUILoader'
import { Tooltip } from 'lib/components/Tooltip'
import { Card, CardDetailsList } from 'lib/components/Card'
import { useTokenFaucetData } from 'lib/hooks/useTokenFaucetData'
import { displayPercentage } from 'lib/utils/displayPercentage'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import CompSvg from 'assets/images/comp.svg'

export const PoolStats = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  const loading =
    !pool.ticketToken || !pool.sponsorshipToken || !pool.reserveRegistry || !pool.reserveTotalSupply

  if (loading) {
    return (
      <Card>
        <h3 className='mb-4'>{t('poolsStats')}</h3>
        <IndexUILoader />
      </Card>
    )
  }

  return (
    <>
      <Card>
        <div className='flex justify-between'>
          <h3>{t('poolsStats')}</h3>
        </div>
        <CardDetailsList>
          <StatsList {...props} />
        </CardDetailsList>
      </Card>
    </>
  )
}

const StatsList = (props) => {
  const { pool } = props

  return (
    <>
      <DepositsStat pool={pool} />
      <SponsorshipStat pool={pool} />
      <ReserveStat pool={pool} />
      <ReserveRateStat pool={pool} />
      <YieldSourceStat pool={pool} />
      <AprStats pool={pool} />
    </>
  )
}

// Generic stat component

const Stat = (props) => {
  const {
    title,
    tokenSymbol,
    convertedValue,
    sourceName,
    sourceImage,
    tokenAmount,
    value,
    percent,
    tooltip
  } = props

  return (
    <li className='flex justify-between mb-2 last:mb-0'>
      <span className='text-accent-1 flex'>
        {title}:{' '}
        {tooltip && <Tooltip id={title} className='ml-2 my-auto text-accent-1' tip={tooltip} />}
      </span>
      {(sourceImage || value) && (
        <span className='flex items-center'>
          <span className='capitalize mr-2'>{sourceName}</span> {sourceImage}{' '}
          {value && <span>{value}</span>}
        </span>
      )}
      {tokenSymbol && tokenAmount && (
        <span>
          {Boolean(convertedValue) && (
            <>
              <span className='opacity-30'>(${numberWithCommas(convertedValue)})</span>{' '}
            </>
          )}
          <PoolNumber>{numberWithCommas(tokenAmount)}</PoolNumber>
          <span>{tokenSymbol}</span>
        </span>
      )}
      {percent && <span>{displayPercentage(percent)}%</span>}
    </li>
  )
}

// Stat components

const DepositsStat = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  const ticketDeposits = ethers.BigNumber.from(pool.ticketToken.totalSupply)
  const ticketDepositsFormatted = ethers.utils.formatUnits(
    ticketDeposits,
    pool.underlyingCollateralDecimals
  )

  return (
    <Stat
      title={t('totalDeposits')}
      convertedValue={pool.totalDepositedUSD}
      tokenSymbol={pool.underlyingCollateralSymbol}
      tokenAmount={ticketDepositsFormatted}
    />
  )
}

const ReserveStat = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  const reserveAmount = ethers.utils.formatUnits(
    pool.reserveTotalSupply,
    pool.underlyingCollateralDecimals
  )

  return (
    <Stat
      title={t('reserve')}
      convertedValue={pool.totalReserveUSD}
      tokenSymbol={pool.underlyingCollateralSymbol}
      tokenAmount={reserveAmount}
      tooltip={t('reserveInfo')}
    />
  )
}

const ReserveRateStat = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  const reserveRatePercentage = pool.reserveRate.mul(100)
  const reserveRate = ethers.utils.formatUnits(reserveRatePercentage, DEFAULT_TOKEN_PRECISION)

  return <Stat title={t('reserveRate')} percent={reserveRate} tooltip={t('reserveRateInfo')} />
}

const YieldSourceStat = (props) => {
  const { pool } = props

  const { t } = useTranslation()
  const yieldSource = pool.prizePool.type

  let sourceImage, sourceName, etherscanLink
  if (yieldSource === PRIZE_POOL_TYPES.compound) {
    sourceName = 'Compound Finance'
    sourceImage = <img src={CompSvg} className='w-6 mr-2' />
  } else if (yieldSource === PRIZE_POOL_TYPES.genericYield) {
    const yieldSourceAddress = pool.yieldSourcePrizePool.yieldSource
    etherscanLink = <EtherscanAddressLink address={yieldSourceAddress} />

    sourceName = CUSTOM_YIELD_SOURCE_NAMES[yieldSourceAddress]

    const providedCustomImage = CUSTOM_YIELD_SOURCE_IMAGES[sourceName]
    let customYieldSourceIcon = '/ticket-bg--light-sm.png'
    if (providedCustomImage) {
      customYieldSourceIcon = providedCustomImage
    }

    sourceImage = <img src={customYieldSourceIcon} className='w-6 mr-2' />
  }

  return (
    <Stat
      title={t('yieldSource')}
      value={
        <>
          {t(yieldSource)} {etherscanLink}
        </>
      }
      sourceName={sourceName}
      sourceImage={sourceImage}
    />
  )
}

// audited vs unaudited

const SponsorshipStat = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  const sponsorshipDeposits = ethers.BigNumber.from(pool.sponsorshipToken.totalSupply)
  const sponsorshipDepositsFormatted = ethers.utils.formatUnits(
    sponsorshipDeposits,
    pool.underlyingCollateralDecimals
  )

  return (
    <>
      <Stat
        title={t('sponsorship')}
        convertedValue={pool.totalSponsoredUSD}
        tokenSymbol={pool.underlyingCollateralSymbol}
        tokenAmount={sponsorshipDepositsFormatted}
        tooltip={t('sponsorshipInfo')}
      />
    </>
  )
}

// APR Stats

const AprStats = (props) => {
  const { pool } = props

  const apr = pool.tokenListener?.apr

  if (!apr) return null

  return (
    <>
      <hr />
      <DailyPoolDistributionStat pool={pool} />
      <EffectiveAprStat apr={apr} />
    </>
  )
}

const DailyPoolDistributionStat = (props) => {
  const { pool } = props

  const { t } = useTranslation()
  const { data, isFetched } = useTokenFaucetData(pool.tokenListener)

  let tokenAmount = '0'
  if (isFetched) {
    const dripRatePerDay = data.dripRatePerSecond.mul(SECONDS_PER_DAY)
    tokenAmount = ethers.utils.formatUnits(dripRatePerDay, DEFAULT_TOKEN_PRECISION)
  }

  return <Stat title={t('dailyPoolDistribution')} tokenSymbol={'POOL'} tokenAmount={tokenAmount} />
}

const EffectiveAprStat = (props) => {
  const { apr } = props

  const { t } = useTranslation()

  return <Stat title={t('effectiveApr')} percent={apr} tooltip={t('effectiveAprInfo')} />
}
