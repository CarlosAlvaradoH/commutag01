import React, { useContext, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import FeatherIcon from 'feather-icons-react'
import ClipLoader from 'react-spinners/ClipLoader'
import { ethers } from 'ethers'
import { useQuery } from '@apollo/client'
import { uniqWith, isEqual, isEmpty, map, find, defaultTo } from 'lodash'

import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'

import { useTranslation } from 'lib/../i18n'
import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { PoolNumber } from 'lib/components/PoolNumber'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { poolToast } from 'lib/utils/poolToast'
import { extractPoolRewardsFromUserDrips } from 'lib/utils/extractPoolRewardsFromUserDrips'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { shorten } from 'lib/utils/shorten'

export const AccountRewardsUI = () => {
  const { t } = useTranslation()
  
  const { pools, dynamicPlayerDrips, usersChainData, graphDripData } = useContext(PoolDataContext)
  const { usersAddress, provider } = useContext(AuthControllerContext)

  const poolAddresses = map(pools, 'poolAddress')
  const playerRewards = extractPoolRewardsFromUserDrips({poolAddresses, dynamicPlayerDrips})

  const referralAddress = `https://pooltogether.com/?referrer=${usersAddress}`
  const shortReferralAddress = `pooltogether.com/?referrer=${shorten(usersAddress)}`

  const { usersDripTokenData } = usersChainData

  const [txId, setTxId] = useState(0)

  const txName = t(`claimRewards`)
  const method = 'updateAndClaimDrips'

  const [sendTx] = useSendTransaction(txName)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const txInFlight = transactions?.find((tx) => tx.id === txId)

  const handleCopy = () => {
    poolToast.success(t('copiedToClipboard'))
  }

  const handleClaim = (drip) => {
    console.log({ drip })
    console.log(drip.id)

    const { comptroller, updatePairs, dripTokens } = getParamsForClaim([drip.id])

    const params = [
      updatePairs,
      usersAddress,
      dripTokens,
      {
        gasLimit: 400000
      }
    ]

    const id = sendTx(
      t,
      provider,
      usersAddress,
      ComptrollerAbi,
      comptroller,
      method,
      params,
    )
    setTxId(id)
  }

  const getParamsForClaim = (drips = []) => {
    const updatePairs = []
    const dripTokens = []
    let comptroller

    for (let i = 0; i < drips.length; i++) {
      let drip = graphDripData.balanceDrips.find(drip => drip.dripToken.toLowerCase() === drips[i].toLowerCase())
      if (!drip) {
        graphDripData.volumeDrips.find(drip => drip.dripToken.toLowerCase() === drips[i].toLowerCase())
      }

      let [
        comptrollerAddress,
        sourceAddress,
        measureTokenAddress,
        dripTokenAddress,
        isReferral,
        playerAddress
      ] = drip.id.split('-')

      isReferral = Boolean(parseInt(isReferral, 10))

      updatePairs.push({
        source: sourceAddress,
        measure: measureTokenAddress,
      })
      dripTokens.push(dripTokenAddress)
      comptroller = comptroller || comptrollerAddress
    }

    return {comptroller, updatePairs, dripTokens}
  }

  const getFormattedNumber = (value, decimals) => {
    const formatted = ethers.utils.formatEther(value, decimals ||  DEFAULT_TOKEN_PRECISION)

    return <>
      <div className='font-bold'>
        <PoolNumber>
          {numberWithCommas(formatted, { precision: 4 })}
        </PoolNumber>
      </div>
    </>
  }

  const getDripDataByAddress = (dripTokenAddress, dripTokenData) => {
    const { usersDripTokenData } = usersChainData
    const dripTokens = playerRewards?.allDrips || []

    const zero = ethers.utils.parseEther('0')

    const dripData = defaultTo(find(dripTokens, d => d.dripToken.address === dripTokenAddress), {
      id: dripTokenAddress,
      dripToken: {
        address: dripTokenAddress,
        ...dripTokenData
      },
      claimable: zero,
      balance: zero
    })

    dripData.claimable = usersDripTokenData ? usersDripTokenData[dripTokenAddress].claimable : zero
    dripData.balance = usersDripTokenData ? usersDripTokenData[dripTokenAddress].balance : zero

    return dripData
  }

  const getClaimButton = (dripData) => {
    console.log({ claimable: dripData.claimable.toString()})
    if (!(dripData.claimable.gt(0))) {
      return ''
    }

    // TODO: Handle multiple claims at once
    if (txInFlight && !txInFlight.completed) {
      return (
        <div className='whitespace-no-wrap'>
          {
            !isEmpty(txInFlight.hash) && (
              <EtherscanTxLink
                chainId={txInFlight.ethersTx.chainId}
                hash={txInFlight.hash}
                className='text-xxxs text-teal mr-3'
              >
                Etherscan
              </EtherscanTxLink>
            )
          }
          <ClipLoader
            size={14}
            color={'#049c9c'}
          />
          <span className='text-teal font-bold ml-2 mt-1'>{t('claiming')}</span>
        </div>
      )
    }

    return (
      <a
        className='underline cursor-pointer stroke-current text-xs font-bold'
        onClick={(e) => {
          e.preventDefault()
          handleClaim(dripData)
        }}
      >
        {t('claim')}
      </a>
    )
  }

  const getRewardsDripRows = () => {
    return map(usersDripTokenData, (dripTokenData, dripTokenAddress) => {
      const dripData = getDripDataByAddress(dripTokenAddress, dripTokenData)

      return (
        <tr key={dripData.id}>
          <td className='px-4 py-2 text-left font-bold'>{dripData.dripToken.name}</td>
          <td className='px-4 py-2 text-left'>
            {getFormattedNumber(dripData.balance, dripData.dripToken.decimals)}
          </td>
          <td className='px-4 py-2 text-left'>
            {getFormattedNumber(dripData.claimable, dripData.dripToken.decimals)}
          </td>
          <td className='px-4 py-2 text-right'>
            {getClaimButton(dripData)}
          </td>
        </tr>
      )
    })
  }

  return <>
    <div
      className='non-interactable-card mt-2 sm:py-3 sm:px-3 sm:bg-card rounded-lg card-min-height-desktop'
    >
      <div
        className='flex flex-col sm:flex-row items-center justify-between bg-primary px-4 py-2 text-inverse rounded-lg'
      >
        <div className='flex-grow uppercase font-semibold text-xxs text-accent-1 pb-2 sm:pb-0'>
          {t('inviteFriendsAndEarnReferralRewards')}
        </div>

        <CopyToClipboard
          text={referralAddress}
          onCopy={handleCopy}
        >
          <a
            className='flex sm:w-1/2 items-center cursor-pointer stroke-current hover:text-secondary text-primary w-full h-8 py-1 mb-2 sm:mb-0 bg-accent-grey-3 hover:bg-highlight-2 rounded-sm'
            title='Copy to clipboard'
          >
            <span className='mx-2 flex-grow font-bold text-xxxs xs:text-xs'>{shortReferralAddress}</span>
            <FeatherIcon
              icon='copy'
              className='w-4 h-4 mx-2 my-1 justify-self-end'
            />
          </a>
        </CopyToClipboard>
      </div>

{/*
      <div className='py-2 px-1'>
        <h2>Rewards wallet</h2>
      </div>

      <div className='bg-highlight-3 rounded-lg text-white pool-gradient-1 mt-2 mb-8 mx-auto px-5 py-5'>
        <div className='flex items-center justify-between'>
          <div className='w-8/12'>
            <div className='text-2xl font-bold text-white -mt-1'>
              123.456<span className='text-accent-1'>789</span>
            </div>
            <div className='text-caption -mt-1 uppercase font-bold'>
              Claimable Rewards
            </div>
          </div>

          <div className='flex flex-col items-end justify-center w-4/12'>
            <Button
              textSize='lg'
              className='rounded-full'
              onClick={handleClaim}
            >
              Claim
            </Button>
          </div>
        </div>
      </div>
*/}

      <div className='py-2 px-1'>
        <h3>{t('rewards')}</h3>
      </div>

      <div
        className='bg-primary text-inverse flex justify-between rounded-lg px-4 py-4 mt-2'
      >
        <table className='table-fixed w-full'>
          <thead>
            <tr>
              <th className='w-1/5 px-4 py-2 text-left'>{t('token')}</th>
              <th className='w-1/5 px-4 py-2 text-left font-bold'>{t('balance')}</th>
              <th className='w-1/5 px-4 py-2 text-left'>{t('claimable')}</th>
              <th className='w-2/5 px-4 py-2'>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {getRewardsDripRows()}
          </tbody>
        </table>
      </div>

    </div>
  </>
}