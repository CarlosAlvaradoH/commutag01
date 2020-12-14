import React, { useContext } from 'react'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { SmallLoader } from 'lib/components/SmallLoader'
import { usePlayerTickets } from 'lib/hooks/usePlayerTickets'
import { normalizeTo18Decimals } from 'lib/utils/normalizeTo18Decimals'
import { testAddress } from 'lib/utils/testAddress'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

// import AccountPlaceholderImg from 'assets/images/avatar-placeholder.svg'
import ChillWalletIllustration from 'assets/images/pt-illustration-chill@2x.png'

export const AccountSummary = () => {
  const { t } = useTranslation()

  const { usersChainData } = useContext(PoolDataContext)
  const { usersAddress } = useContext(AuthControllerContext)

  // fill this in with a watched address or an address from router params
  const playerAddress = ''
  const address = playerAddress || usersAddress

  const { playerTickets } = usePlayerTickets(address)

  // controlledTokenBalances
  // const { data: prizePoolAccounts } = usePlayerControlledTokenBalances(usersAddress)


  // const playerAddressError = testAddress(usersAddress)
 
  

  // const blockNumber = -1
  // const {
  //   data: playerData,
  //   error,
  // } = useAccountQuery(usersAddress, blockNumber, playerAddressError)

  // if (error) {
  //   console.error(error)
  // }
  const daiBalances = {
    poolBalance: usersChainData?.v2DaiPoolCommittedBalance,
    podBalance: usersChainData?.v2DaiPodCommittedBalance,
    podSharesBalance: usersChainData?.v2DaiPodSharesBalance,
  }

  const usdcBalances = {
    poolBalance: usersChainData?.v2UsdcPoolCommittedBalance,
    podBalance: usersChainData?.v2UsdcPodCommittedBalance,
    podSharesBalance: usersChainData?.v2UsdcPodSharesBalance,
  }

  let totalTickets = ethers.utils.bigNumberify(0)
  playerTickets.forEach(playerTicket => {
    let { balanceNormalized } = playerTicket

    totalTickets = totalTickets.add(balanceNormalized)
  })

  if (daiBalances.poolBalance) {
    const normalizedDaiPoolBalance = normalizeTo18Decimals(daiBalances.poolBalance, 18)
    totalTickets = totalTickets.add(normalizedDaiPoolBalance)

    const normalizedDaiPodBalance = normalizeTo18Decimals(daiBalances.podBalance, 18)
    totalTickets = totalTickets.add(normalizedDaiPodBalance)

    const normalizedUsdcPoolBalance = normalizeTo18Decimals(usdcBalances.poolBalance, 6)
    totalTickets = totalTickets.add(normalizedUsdcPoolBalance)

    const normalizedUsdcPodBalance = normalizeTo18Decimals(usdcBalances.podBalance, 6)
    totalTickets = totalTickets.add(normalizedUsdcPodBalance)
  }

  return <>
    <div
      className='purple-pink-gradient rounded-lg pl-6 pr-10 xs:px-12 py-5 text-inverse my-4 sm:mt-8 sm:mb-12 mx-auto'
    >
      <div
        className='flex justify-between items-center'
      >
        <div
          className='leading-tight'
        >
          <h6
            className='font-normal'
          >
            {t('assets')}
          </h6>
          <h1>
            {usersAddress ? <>
              ${displayAmountInEther(totalTickets, 10)}
            </> : <>
              <SmallLoader />
            </>}
          </h1>
        </div>

        <div>
          <img
            src={ChillWalletIllustration}
            alt={`chillin' wallet illustration`}
            className='w-32 xs:w-40 mx-auto relative mb-4 -mr-4'
            style={{
              right: -10,
              top: 17
            }}
          />
        </div>

        
      </div>
    </div>

  </>
}
