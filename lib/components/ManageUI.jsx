import React, { useContext, useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import { ethers } from 'ethers'
import { isEmpty } from 'lodash'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { CardGrid } from 'lib/components/CardGrid'
import { LoadingSpinner } from 'lib/components/LoadingSpinner'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { Meta } from 'lib/components/Meta'
import { SponsorshipPane } from 'lib/components/SponsorshipPane'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PoolActionsUI } from 'lib/components/PoolActionsUI'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { Tagline } from 'lib/components/Tagline'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const ManageUI = (
  props,
) => {
  const { t } = useTranslation()

  const { usersAddress } = useContext(AuthControllerContext)
  const {
    loading,
    contractAddresses,
    pool,
  } = useContext(PoolDataContext)

  if (loading) {
    return <IndexUILoader />
  }

  const decimals = pool?.underlyingCollateralDecimals
  const tickerUpcased = pool?.underlyingCollateralSymbol?.toUpperCase()

  const isRngCompleted = pool?.isRngCompleted
  const isRngRequested = pool?.isRngRequested
  const canStartAward = pool?.canStartAward
  const canCompleteAward = pool?.canCompleteAward

  const poolLocked = canCompleteAward || (isRngRequested && !canCompleteAward)
  const openPhase = !canStartAward && !canCompleteAward && !isRngRequested

  const exitFeeMantissa = pool?.exitFeeMantissa ?? '0'
  const creditRateMantissa = pool?.creditRateMantissa ?? '0'

  return <>
    <Meta
      title={`${pool?.name} - ${t('manage')} - ${t('pools')}`}
    />

    <PageTitleAndBreadcrumbs
      title={`Pool Management`}
      pool={pool}
      breadcrumbs={[
        {
          href: '/',
          as: '/',
          name: t('pools'),
        },
        {
          href: '/pools/[symbol]',
          as: `/pools/${pool?.symbol}`,
          name: pool?.name,
        },
        {
          name: t('manage')
        }
      ]}
    />

    <div
      className='bg-highlight-3 rounded-lg px-4 pt-4 pb-5 xs:p-10 text-white mt-4 sm:mt-16 flex flex-col justify-center'
    >
      <h4>
        {t('poolStatus')} <span className='text-green'>
          {poolLocked && <>
            {t('poolLocked')} <FeatherIcon
              strokeWidth='0.09rem'
              icon='lock'
              className='inline-block w-6 h-6 relative'
              style={{
                top: -3
              }}
            />
          </>}
          {canStartAward && <>
            {t('readyToBeAwarded')} <FeatherIcon
              strokeWidth='0.09rem'
              icon='check'
              className='inline-block w-6 h-6 relative'
              style={{
                top: -3
              }}
            />
          </>}
          {openPhase && <>
            {t('open')} <FeatherIcon
              strokeWidth='0.09rem'
              icon='clock'
              className='inline-block w-6 h-6 relative'
              style={{
                top: -3
              }}
            />
          </>}
        </span>
      </h4>

      <p className='text-caption font-bold'>
        {isRngRequested && !canCompleteAward && <>
          {t('waitingOnRandomNumberGeneration')}
          <span
            className='w-6 flex items-start justify-start mt-6'
          >
            <LoadingSpinner />
          </span>
        </>}

        {canStartAward && <>
          {t('prizeRewardProcessReady')}
          {/* Prize reward process ready to be started! */}
        </>}

        {canCompleteAward && <>
          {t('prizeRewardProcessReadyToFinish')}
          {/* Prize reward process ready to be finished! */}
        </>}

        {openPhase && <>
          {t('poolAcceptingDepositsAndWithdrawals')}
          {/* Pool is accepting deposits and withdrawals. */}
        </>}
      </p>

      <div
        className='mt-4'
      >
        {openPhase ? <>
          <h6
            className='mb-2'
          >
            {t('prizePeriodRemaining')}
          </h6>
          <NewPrizeCountdown
            pool={pool}
            flashy={false}
          />
        </> : <>
          <PoolActionsUI
            contractAddresses={contractAddresses}
            usersAddress={usersAddress}
          />
        </>}
      </div>
    </div>

    <SponsorshipPane
      pool={pool}
      decimals={decimals}
      tickerUpcased={tickerUpcased}
      usersAddress={usersAddress}
    />

    {pool && !isEmpty(pool) && <>
      <CardGrid
        cardGroupId='manage-pool-cards'
        cards={[
          // {
          //   icon: null,
          //   title: <>
          //     {t('exitFee')} (<a
          //       href='https://docs.pooltogether.com/tutorials/withdrawing-from-a-prize-pool#withdrawing-funds-instantly'
          //       target='_blank'
          //       rel='noreferrer nofollow'
          //     >exitFeeMantissa</a>)
          //   </>,
          //   content: <>
          //     <h3>
          //       {displayAmountInEther(
          //         ethers.utils.bigNumberify(exitFeeMantissa).mul(100).toString(),
          //         { precision: 6 }
          //       )} %
          //     </h3>
          //   </>
          // },
          // {
          //   icon: null,
          //   title: <>
          //     {t('creditRate')} (<a
          //       href='https://docs.pooltogether.com/tutorials/withdrawing-from-a-prize-pool#withdrawing-funds-instantly'
          //       target='_blank'
          //       rel='noreferrer nofollow'
          //     >creditRateMantissa</a>)
          //   </>,
          //   content: <>
          //     <h3>
          //       {displayAmountInEther(
          //         ethers.utils.bigNumberify(creditRateMantissa).mul(100).toString(),
          //         { precision: 6 }
          //       )} %
          //     </h3>
          //   </>
          // },
          {
            icon: null,
            title: t('prizePeriodInSeconds'),
            content: <h3>{numberWithCommas(
              pool?.prizePeriodSeconds,
              { precision: 0 }
            )}</h3>
          },
          {
            icon: null,
            title: t('sponsorship'),
            content: <h3>{displayAmountInEther(
              pool?.totalSponsorship,
              { decimals, precision: 0 }
            )} {tickerUpcased}</h3>
          },
        ]}
      />

      {/* {pool && <pre>{JSON.stringify(pool, null, 2)}</pre>} */}
    </>}

    <Tagline />
  </>
}
