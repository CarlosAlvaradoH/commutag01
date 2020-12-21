import React, { useContext, useState } from 'react'

import { STRINGS } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { AccountTicket } from 'lib/components/AccountTicket'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { WithdrawTicketsForm } from 'lib/components/WithdrawTicketsForm'
import { usePlayerTickets } from 'lib/hooks/usePlayerTickets'
import { usePool } from 'lib/hooks/usePool'
import { testAddress } from 'lib/utils/testAddress'
import { useAccountQuery } from 'lib/hooks/useAccountQuery'

export function ManageTicketsForm(props) {
  const { t } = useTranslation()

  const { usersAddress } = useContext(AuthControllerContext)

  const { pool } = usePool()

  const playerAddressError = testAddress(usersAddress)

  const blockNumber = -1
  let {
    data: playerData,
    error,
  } = useAccountQuery(usersAddress, blockNumber, playerAddressError)

  if (error) {
    console.error(error)
  }

  const ticketAddress = pool?.ticketToken?.id
  const balance = playerData?.controlledTokenBalances.find(ct => ct.controlledToken.id === ticketAddress)?.balance

  const [action, setAction] = useState(STRINGS.withdraw)

  const { playerTickets } = usePlayerTickets(usersAddress)
  console.log(playerTickets)
  const playerTicket = playerTickets?.find(playerTicket => playerTicket.pool.id === pool?.id)

  return <>
    <div
      className='pane-title'
    >
      <div
        className={`leading-tight font-bold text-lg xs:text-3xl lg:text-4xl text-inverse mb-4 xs:mb-8`}
      >
        {t('manageYourTickets')}
      </div>
    </div>

    <div className='mx-auto mt-4 xs:mb-8'>
      <AccountTicket
        noMargin
        key={`account-pool-row-${pool?.poolAddress}`}
        // pool={pool}
        // playerBalance={balance}
        playerTicket={playerTicket}
      />
    </div>

    <DropdownInputGroup
      id='manage-tickets-action-dropdown'
      label={t('whatWouldYouLikeToDoQuestion')}
      current={action}
      setCurrent={setAction}
      options={{
        [STRINGS.withdraw]: t('withdraw'),
        // [STRINGS.transfer]: t('transfer')
      }}
    />

    {/* {action === STRINGS.transfer && <>
      <h6 className='mt-2 text-inverse'>Transfer feature coming soon ...</h6>
    </>} */}

    {action === STRINGS.withdraw && <>
      <WithdrawTicketsForm
        {...props}
      />
    </>}

  </>
}