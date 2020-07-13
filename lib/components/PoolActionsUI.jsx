import React from 'react'

// import { CompleteAwardUI } from 'lib/components/CompleteAwardUI'
// import { PoolRelatedAddressesUI } from 'lib/components/PoolRelatedAddressesUI'
import { PoolStats } from 'lib/components/PoolStats'
// import { StartAwardUI } from 'lib/components/StartAwardUI'

export const PoolActionsUI = (props) => {
  return <>
    <PoolStats
      {...props}
    />
    
    {/* <StartAwardUI
      {...props}
    />
    <CompleteAwardUI
      {...props}
    /> */}

    {/* <PoolRelatedAddressesUI
      {...props}
    /> */}
  </>
}

