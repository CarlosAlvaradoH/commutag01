import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useAtom } from 'jotai'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePool } from 'lib/hooks/usePool'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export function WithdrawTxButton(props) {
  const { t } = useTranslation()
  
  const [transactions, setTransactions] = useAtom(transactionsAtom)

  const {
    quantityBN,
    quantity,
    needsApproval,
    tickerUpcased,
  } = props

  const { usersAddress, provider } = useContext(AuthControllerContext)
  const { pool } = usePool()

  const poolAddress = pool?.poolAddress
  const sponsorshipAddress = pool?.sponsorshipToken?.id



  const [txId, setTxId] = useState()

  // const txName = `Withdraw Sponsorship (${quantity} ${tickerUpcased})`
  const txName = t(`withdrawSponsorshipAmountTicker`, {
    amount: quantity,
    ticker: tickerUpcased
  })

  // const txName = `Withdraw Sponsorship (${quantity} ${tickerUpcased})`
  const method = 'withdrawInstantlyFrom'

  const [sendTx] = useSendTransaction(txName, transactions, setTransactions)

  
  
  const tx = transactions?.find((tx) => tx.id === txId)

  const withdrawSponsorshipTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)



  const handleWithdrawSponsorshipClick = async (e) => {
    e.preventDefault()

    // there should be no exit fee when withdrawing sponsorship
    const maxExitFee = '0'

    const params = [
      usersAddress,
      quantityBN,
      sponsorshipAddress,
      ethers.utils.parseEther(maxExitFee),
    ]

    const id = await sendTx(
      t,
      provider,
      usersAddress,
      PrizePoolAbi,
      poolAddress,
      method,
      params
    )
    setTxId(id)
  }


  return <>
    <Button
      noAnim
      textSize='lg'
      onClick={handleWithdrawSponsorshipClick}
      disabled={!quantity || needsApproval || withdrawSponsorshipTxInFlight}
      className={'w-full'}
    >
      Withdraw sponsorship
    </Button>
  </>
}