import { transactionsVar } from 'lib/apollo/cache'
import { createTransactionFactory } from 'lib/apollo/createTransactionFactory'
import { callTransaction } from 'lib/utils/callTransaction'

const createTransaction = createTransactionFactory(transactionsVar)

export const useSendTransaction = function (txName) {
  const sendTx = (
    provider,
    contractAbi,
    contractAddress,
    method,
    params = []
  ) => {
    const transactions = transactionsVar()
    const txId = transactions.length + 1

    let newTx = {
      __typename: 'Transaction',
      id: txId,
      name: txName,
      inWallet: true,
      method,
      hash: '',
    }

    createTransaction(newTx)

    callTransaction(
      newTx,
      provider,
      contractAddress,
      contractAbi,
      method,
      params,
    )

    return txId
  }

  return [sendTx]
}