import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useQuery } from '@apollo/client'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { PTHint } from 'lib/components/PTHint'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export const DepositSponsorshipTxButton = (props) => {
  const {
    decimals,
    quantity,
    needsApproval,
    tickerUpcased,
  } = props

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool, refetchSponsorQuery } = poolData

  const poolAddress = pool?.poolAddress
  const sponsorshipAddress = pool?.sponsorship
  



  const [txId, setTxId] = useState()

  const txName = `Deposit ${quantity} ${tickerUpcased} to Sponsorship`
  const method = 'depositTo'

  const [sendTx] = useSendTransaction(txName, refetchSponsorQuery)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((tx) => tx.id === txId)

  const depositSponsorshipTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)



  const handleDepositSponsorshipClick = async (e) => {
    e.preventDefault()

    const params = [
      usersAddress,
      ethers.utils.parseUnits(
        quantity,
        Number(decimals)
      ),
      sponsorshipAddress,
      [],
      {
        gasLimit: 550000
      }
    ]

    const id = sendTx(
      provider,
      usersAddress,
      PrizePoolAbi,
      poolAddress,
      method,
      params
    )
    setTxId(id)
  }


  const depositSponsorshipButtonClassName = needsApproval ? 'w-full' : 'w-48-percent'

  const depositSponsorshipButton = <Button
    noAnim
    textSize='lg'
    onClick={handleDepositSponsorshipClick}
    disabled={!quantity || needsApproval || depositSponsorshipTxInFlight}
    className={depositSponsorshipButtonClassName}
  >
    Deposit sponsorship
  </Button>


  return <>
    {needsApproval ? <>
      <PTHint
        title='Allowance'
        tip={<>
          <div className='my-2 text-xs sm:text-sm'>
            You need to provide enough allowance to this pool and prior to depositing anymore.
          </div>
        </>}
        className='w-48-percent'
      >
        {depositSponsorshipButton}
      </PTHint>
    </> : depositSponsorshipButton}
  </>
}