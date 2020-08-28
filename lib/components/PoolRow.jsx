import React from 'react'
import FeatherIcon from 'feather-icons-react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { ButtonLink } from 'lib/components/ButtonLink'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { NonInteractableCard } from 'lib/components/NonInteractableCard'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const PoolRow = (
  props,
) => {  
  const {
    pool,
  } = props
  
  const [t] = useTranslation()
  const router = useRouter()

  if (!pool || !pool.symbol) {
    return null
  }

  const symbol = pool.symbol
  const decimals = pool?.underlyingCollateralDecimals

  return <>
    <NonInteractableCard
      key={`pool-row-${pool.poolAddress}`}
      href='/pools/[symbol]'
      as={`/pools/${symbol}`}
    >
      <div className='flex items-center'>
        <div
          className='flex items-center font-bold w-8/12 sm:w-6/12 lg:w-6/12'
        >
          <Link
            href='/pools/[symbol]'
            as={`/pools/${pool.symbol}`}
          >
            <a
              className='inline-block w-12 xs:w-12 sm:w-16 lg:w-20 xs:mr-2'
            >
              <PoolCurrencyIcon
                lg
                pool={pool}
              />
            </a>
          </Link>

          <div
            className='flex flex-col items-start justify-between w-full ml-1 sm:ml-4 leading-none'
          >
            <div
              className='inline-block text-left text-sm xs:text-xl sm:text-3xl font-bold text-inverse relative'
              style={{
                top: -6
              }}
            >
              Prize ${displayAmountInEther(
                pool?.estimatePrize,
                { decimals, precision: 2 }
              )}
            </div>
            <div
              className='inline-block text-left text-caption-2 relative'
              style={{
                left: 2,
                bottom: -4
              }}
            >
              <span
                className='uppercase text-caption'
              >
                {pool.frequency}
              </span>
            </div>
          </div>
        </div>

        <div
          className='flex flex-col items-end w-4/12 sm:w-9/12 lg:w-9/12'
        >
          <NewPrizeCountdown
            pool={pool}
          />
        </div>
      </div>

      <div
        className='mt-5 flex items-center justify-between'
      >
        <div
          className='w-full xs:w-7/12 sm:w-4/12 lg:w-6/12 pr-2'
        >
          <ButtonLink
            width='w-full'
            textSize='lg'
            href='/pools/[symbol]/deposit'
            as={`/pools/${pool.symbol}/deposit`}
          >
            {t('getTickets')}
          </ButtonLink>
        </div>

        <div
          className='w-2/12 text-right'
          style={{
            lineHeight: 1.2,
          }}
        >
          <ButtonLink
            border='accent-2 border-2'
            text='accent-2'
            bg='primary'
            hoverBorder='highlight-2'
            hoverText='highlight-2'
            hoverBg='primary'

            padding='pl-2 pr-0 py-2 sm:py-2'
            width='w-10 h-10 lg:w-12 lg:h-12'
            className='inline-flex items-center justify-center'

            rounded='full'
            href='/pools/[symbol]'
            as={`/pools/${pool.symbol}`}

          >
            <FeatherIcon
              strokeWidth='2'
              icon='arrow-right'
              className='relative w-7 h-7 mx-auto'
              style={{
                left: -4
              }}
            />
          </ButtonLink>
        </div>
      </div>
    </NonInteractableCard>
  </>
}
