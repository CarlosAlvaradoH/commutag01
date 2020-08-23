import React from 'react'
import FeatherIcon from 'feather-icons-react'
import { ethers } from 'ethers'

import { InteractableCard } from 'lib/components/InteractableCard'
import { Odds } from 'lib/components/Odds'
import { PrizeAmount } from 'lib/components/PrizeAmount'
import { PrizePoolCountdown } from 'lib/components/PrizePoolCountdown'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolCountUp } from 'lib/components/PoolCountUp'

export const AccountPoolRow = (
  props,
) => {
  const { pool, player } = props

  const underlyingCollateralDecimals = pool && pool.underlyingCollateralDecimals

  let usersBalance = 0
  if (player && player.balance && !isNaN(underlyingCollateralDecimals)) {
    usersBalance = Number(ethers.utils.formatUnits(
      player.balance,
      Number(underlyingCollateralDecimals)
    ))
  }
  
  return <>
    <InteractableCard
      key={`account-pool-row-li-${pool.poolAddress}`}
      href='/account/pools/[symbol]'
      as={`/account/pools/${pool.symbol}`}
    >
      <div className='flex flex-row justify-between items-center'>
        <div className='flex flex-cwol justify-center items-start w-10/12'>
          <div className='flex flex-row justify-between items-start w-full'>
            <div
              className='flex items-start w-2/12 sm:w-2/12'
            >
              <PoolCurrencyIcon
                pool={pool}
                className='inline-block w-12 h-12'
              />
            </div>

            <div
              className='w-10/12 sm:w-11/12 text-left ml-2'
            >
              <PrizeAmount
                {...props}
              />
            </div>
          </div>


          <div className='flex flex-row justify-between items-start w-full text-left mt-2 text-xxs sm:text-base'>
            <div className='flex flex-col justify-between items-start sm:w-2/3'>
              <div
                className='sm:my-1'
              >
                {pool?.name}
              </div>
              <div
                className='sm:my-1'
              >
                Tickets: <PoolCountUp
                  end={usersBalance}
                  decimals={null}
                />
              </div>
              <div
                className='sm:my-1'
              >
                <Odds
                  showLabel
                  splitLines
                  pool={pool}
                  usersBalance={usersBalance}
                />
              </div>
            </div>

            <div
              className='flex flex-col w-6/12 sm:w-10/12 lg:w-11/12 flex items-start sm:w-1/3'
            >
              <div
                className='flex items-center sm:my-1'
              >
                <PrizePoolCountdown
                  pool={pool}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col justify-center items-center w-2/12 sm:w-1/12'>
          <div
            className='mb-1'
          >
            <FeatherIcon
              icon='arrow-right-circle'
              className='stroke-current w-6 h-6 sm:w-8 sm:h-8'
            />
          </div>
          
          <div
            className='mt-1'
          >
            View
          </div>
        </div>
      </div>
    </InteractableCard>
  </>
}
