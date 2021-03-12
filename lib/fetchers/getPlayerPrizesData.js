import { playerPrizesQuery } from 'lib/queries/playerPrizesQuery'

export const getPlayerPrizesData = async (graphQLClient, playerAddress) => {
  const query = playerPrizesQuery()

  const variables = {
    playerAddress
  }

  let data
  try {
    data = await graphQLClient.request(query, variables)
  } catch (error) {
    console.error(error)
  }

  return data
}
