import React, { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import { Button } from 'lib/components/Button'
import { FormattedFutureDateCountdown } from 'lib/components/FormattedFutureDateCountdown'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PTHint } from 'lib/components/PTHint'
import { QuestionMarkCircle } from 'lib/components/QuestionMarkCircle'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const InstantOrScheduledForm = (props) => {
  const router = useRouter()

  const { nextStep, pool, exitFees, quantity } = props
  const [withdrawType, setWithdrawType] = useState('scheduled')

  const handleWithdrawTypeChange = (e) => {
    setWithdrawType(e.target.value)
  }

  const underlyingCollateralDecimals = pool && pool.underlyingCollateralDecimals
  const underlyingCollateralSymbol = pool && pool.underlyingCollateralSymbol

  const {
    instantCredit,
    instantFee,
  } = exitFees

  let instantFull = ethers.utils.bigNumberify(0)
  let instantPartial = ethers.utils.bigNumberify(0)
  if (quantity && underlyingCollateralDecimals) {
    instantPartial = ethers.utils.parseUnits(
      quantity,
      Number(underlyingCollateralDecimals)
    ).sub(instantFee)

    instantFull = ethers.utils.parseUnits(
      quantity,
      Number(underlyingCollateralDecimals)
    )
  }
 
  const scheduledFullFormatted = displayAmountInEther(
    instantFull,
    { decimals: underlyingCollateralDecimals }
  )
  const instantPartialFormatted = displayAmountInEther(
    instantPartial,
    { decimals: underlyingCollateralDecimals }
  )
  const instantFeeFormatted = displayAmountInEther(
    instantFee,
    { decimals: underlyingCollateralDecimals }
  )

  const tipJsx = <>
    To maintain fairness your funds need to contribute interest towards the prize each week. You can:
    <br /><br />1) SCHEDULE: receive ${quantity} DAI once enough interest has been provided to the prize
    <br /><br />2) INSTANT: pay ${displayAmountInEther(
      instantFee,
      { decimals: underlyingCollateralDecimals }
    )} to withdraw right now and forfeit the interest that would otherwise go towards the prize
  </>

  const updateParamsAndNextStep = (e) => {
    e.preventDefault()

    if (withdrawType === 'instant') {
      queryParamUpdater.add(router, {
        withdrawType,
        net: instantPartialFormatted,
        fee: instantFeeFormatted,
      })
    } else if (withdrawType === 'scheduled') {
      queryParamUpdater.add(router, {
        withdrawType,
        timelockDuration: exitFees.timelockDuration,
      })
    }

    nextStep()
  }

  const formattedFutureDate = <FormattedFutureDateCountdown
    futureDate={Number(exitFees.timelockDuration)}
  />

  return <div
    className='text-inverse'
  >
    <PaneTitle>
      Withdraw {quantity} tickets
    </PaneTitle>

    <div className='mt-4'>
      <PaneTitle small>
        Choose how to receive your funds:
      </PaneTitle>
    </div>

    <RadioInputGroup
      label=''
      name='withdrawType'
      onChange={handleWithdrawTypeChange}
      value={withdrawType}
      radios={[
        {
          value: 'scheduled',
          label: <>
            I want <span className='font-bold'>${scheduledFullFormatted}</span> <span className='font-bold'>{underlyingCollateralSymbol}</span> back in: <br />{formattedFutureDate}
          </>
        },
        {
          value: 'instant',
          label: <>
            I want <span className='font-bold'>${instantPartialFormatted}</span> <span className='font-bold'>{underlyingCollateralSymbol}</span> now, and will forfeit the interest
          </>
        }
      ]}
    />



    {withdrawType === 'scheduled' ? <>
      <div
        className='flex items-center justify-center py-4 px-10 sm:w-7/12 mx-auto rounded-xl -mx-6 sm:mx-auto bg-primary text-inverse'
        style={{
          minHeight: 70
        }}
      >
        <PTHint
          tip={tipJsx}
        >
          <>
            <div className='w-10 mx-auto mb-2'>
              <QuestionMarkCircle />
            </div>
            Your <span className='font-bold'>${scheduledFullFormatted}</span> worth of <span className='font-bold'>{underlyingCollateralSymbol}</span> will be scheduled and ready to withdraw in: {formattedFutureDate}
          </>
        </PTHint>
      </div>
      <button
        className='active:outline-none focus:outline-none trans text-blue hover:text-secondary underline rounded-xl outline-none mt-4 mx-8'
        onClick={(e) => {
          e.preventDefault()
          setWithdrawType('instant')
        }}
      >
        Need your funds right now?
      </button>
    </> : <>
      <div
        className='flex items-center justify-center py-4 px-10 sm:w-7/12 mx-auto rounded-xl -mx-6 sm:mx-auto bg-primary text-inverse'
        style={{
          minHeight: 70
        }}
      >
        <PTHint
          tip={tipJsx}
        >
            <>
              <div className='w-10 mx-auto mb-2'>
                <QuestionMarkCircle />
              </div>
              You will receive <span className='font-bold'>${instantPartialFormatted}</span> in <span className='font-bold'>{underlyingCollateralSymbol}</span> now and {instantFee.eq(0)
                ? <>burn <span className='font-bold'>${displayAmountInEther(instantCredit)}</span> in <span className='font-bold'>{underlyingCollateralSymbol}</span> from your fairness credit</>
                : <>forfeit <span className='font-bold'>${instantFeeFormatted}</span> in <span className='font-bold'>{underlyingCollateralSymbol}</span> as interest to the pool</>
            } </>
        </PTHint>
      </div>
      <button
        className='active:outline-none focus:outline-none trans text-blue hover:text-secondary underline rounded-xl outline-none mt-4 mx-8'
        onClick={(e) => {
          e.preventDefault()
          setWithdrawType('scheduled')
        }}
      >
        Don't want to forfeit a ${instantFeeFormatted} {underlyingCollateralSymbol} fairness fee?
      </button>
    </>}

    <div className='mt-8'>
      <Button
        textSize='lg'
        onClick={updateParamsAndNextStep}
      >
        {t('continue')}
      </Button>
    </div> 
      
  </div> 
}
