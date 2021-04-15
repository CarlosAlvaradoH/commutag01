import React, { useMemo } from 'react'
import Link from 'next/link'
import { useTable } from 'react-table'
import BeatLoader from 'react-spinners/BeatLoader'

import { useTranslation } from 'lib/../i18n'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { TableRowUILoader } from 'lib/components/loaders/TableRowUILoader'
import { DefaultPaginationButtons } from 'lib/components/PaginationUI'
import { usePaginatedPastPrizes } from 'lib/hooks/usePastPrizes'
import { formatDate } from 'lib/utils/formatDate'
import { BasicTable } from 'lib/components/BasicTable'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

/**
 * A full table component displaying the past prizes of a pool
 * with pagination & empty states
 * @param {*} props
 * @returns
 */
export const PoolPrizesTable = (props) => {
  const { t } = useTranslation()
  const { pool } = props

  const { data: prizes, page, pages, isFetched: prizePoolsIsFetched } = usePaginatedPastPrizes(pool)
  const baseAsPath = `/prizes/${pool.symbol}`
  const baseHref = '/prizes/[symbol]'

  if (!prizePoolsIsFetched || !pool) {
    return (
      <div className='mt-10'>
        <TableRowUILoader rows={5} />
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center text-center mt-10'>
      {prizes?.length === 0 && (
        <BlankStateMessage>
          <div className='mb-4'>
            {t('thereAreNoPrizesYet')}
            {/* There are no prizes for this pool yet. */}
          </div>
          <ButtonLink secondary href='/pools/[symbol]/manage' as={`/pools/${pool.symbol}/manage`}>
            {t('managePool')}
          </ButtonLink>
        </BlankStateMessage>
      )}

      {prizes?.length > 0 && (
        <>
          <PrizesTable {...props} pool={pool} prizes={prizes} />
          <DefaultPaginationButtons
            currentPage={page}
            totalPages={pages}
            baseAsPath={baseAsPath}
            baseHref={baseHref}
          />
        </>
      )}
    </div>
  )
}

/**
 * The actual table to show prizes
 * @param {*} props
 * @returns
 */
const PrizesTable = (props) => {
  const { t } = useTranslation()
  const { pool, prizes, querySymbol } = props

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'prizeNumber'
      },
      {
        Header: t('prize'),
        accessor: 'prizeAmount' // accessor is the "key" in the data
      },
      {
        Header: t('awardedOn'),
        accessor: 'awardedAt'
      },
      {
        Header: '',
        accessor: 'view',
        Cell: (row) => <div style={{ textAlign: 'right' }}>{row.value}</div>
      }
    ],
    []
  )

  const data = useMemo(() => {
    const prizeRows = prizes.map((prize) => formatPrizeObject(t, pool, prize, querySymbol))

    const lastPrize = prizes[0]

    let currentPrize

    // If we have a prize amount then we know the last prize has been rewarded
    if (lastPrize.awardedBlock) {
      currentPrize = {
        prizeAmount: (
          <span className='text-flashy'>
            ${numberWithCommas(pool.prize.totalValueUsd, { precision: 2 })}
          </span>
        ),
        awardedAt: <span className='text-flashy'>{t('current')}</span>,
        view: (
          <Link href='/pools/[symbol]' as={`/pools/${querySymbol}`} shallow>
            <a className='trans text-right w-full'>{t('viewDetails')}</a>
          </Link>
        )
      }

      prizeRows.unshift(currentPrize)
    }

    return prizeRows
  }, [pool, prizes])

  const tableInstance = useTable({
    columns,
    data
  })

  return <BasicTable tableInstance={tableInstance} />
}

/**
 * A link to the prize view
 * @param {*} props
 * @returns
 */
const PrizeLink = (props) => {
  const { t, pool, prize } = props
  return (
    <Link href='/prizes/[symbol]/[prizeNumber]' as={`/prizes/${pool.symbol}/${prize.id}`} shallow>
      <a className='trans text-right w-full'>{t('viewDetails')}</a>
    </Link>
  )
}

/**
 * Formats a prize into a row for the table
 * @param {*} t
 * @param {*} pool
 * @param {*} prize
 * @param {*} querySymbol
 * @returns
 */
const formatPrizeObject = (t, pool, prize, querySymbol) => ({
  prizeNumber: prize.id,
  startedAt: formatDate(prize.prizePeriodStartedTimestamp),
  awardedAt: <span className='block'>{formatDate(prize.awardedTimestamp)}</span>,
  prizeAmount: <span>{`$${numberWithCommas(prize.totalValueUsd, { precision: 2 })}`}</span>,
  view: <PrizeLink t={t} pool={pool} prize={prize} />
})