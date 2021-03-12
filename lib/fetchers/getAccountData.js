import { accountQuery } from 'lib/queries/accountQuery'

export const getAccountData = async (graphQLClient, accountAddress, blockNumber) => {
  const query = accountQuery(blockNumber)

  const variables = {
    accountAddress
  }

  let data
  try {
    data = await graphQLClient.request(query, variables)
  } catch (error) {
    console.error(error)
  }

  return data?.account
}
