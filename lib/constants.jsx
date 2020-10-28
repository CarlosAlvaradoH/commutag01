// const PermitAndDepositDaiMainnet = require(`@pooltogether/pooltogether-contracts/deployments/mainnet/PermitAndDepositDai.json`)
// const PermitAndDepositDaiRinkeby = require(`@pooltogether/pooltogether-contracts/deployments/rinkeby/PermitAndDepositDai.json`)
// const PermitAndDepositDaiRopsten = require(`@pooltogether/pooltogether-contracts/deployments/ropsten/PermitAndDepositDai.json`)

export const SUPPORTED_CHAIN_IDS = [1, 3, 4, 31337, 1234]

export const CREATOR_ADDRESS = '0xe0f4217390221af47855e094f6e112d43c8698fe'

export const SECONDS_PER_BLOCK = 14

export const DEFAULT_TOKEN_PRECISION = 18

export const MAINNET_POLLING_INTERVAL = process.env.NEXT_JS_DOMAIN_NAME ? 30000 : 20000

export const MAX_SAFE_INTEGER = 9007199254740991

// cookie names
export const REFERRER_ADDRESS_KEY = 'referrerAddress'
export const WIZARD_REFERRER_HREF = 'wizardReferrerHref'
export const WIZARD_REFERRER_AS_PATH = 'wizardReferrerAsPath'
export const STORED_CHAIN_ID_KEY = 'chainId'
export const TRANSACTIONS_KEY = 'txs'
export const SHOW_MANAGE_LINKS = 'showManageLinks'
export const MAGIC_EMAIL = 'magicEmail'
export const SELECTED_WALLET_COOKIE_KEY = 'selectedWallet'

export const CONFETTI_DURATION_MS = 12000

const domain = process.env.NEXT_JS_DOMAIN_NAME && `.${process.env.NEXT_JS_DOMAIN_NAME}`
export const COOKIE_OPTIONS = {
  sameSite: 'strict',
  secure: process.env.NEXT_JS_DOMAIN_NAME === 'pooltogether.com',
  domain
}

export const CONTRACT_ADDRESSES = {
  1: {
    // Dai: '0x6b175474e89094c44da98b954eedeac495271d0f',
    // PermitAndDepositDai: PermitAndDepositDaiMainnet.address
  },
  3: {
    // Dai: '0xc2118d4d90b274016cb7a54c03ef52e6c537d957',
    // PermitAndDepositDai: PermitAndDepositDaiRopsten.address
  },
  4: {
    // PermitAndDepositDai: PermitAndDepositDaiRinkeby.address,
  },
}

export const TOKEN_IMAGES = {
  '0x6b175474e89094c44da98b954eedeac495271d0f': 'https://assets.coingecko.com/coins/images/9956/thumb/dai-multi-collateral-mcd.png',
  '0x06f65b8cfcb13a9fe37d836fe9708da38ecb29b2': 'https://assets.coingecko.com/coins/images/11521/thumb/FAME.png?1590622461',
  '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b': 'https://assets.coingecko.com/coins/images/12465/thumb/defi_pulse_index_set.png',
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png?1600306604',
  '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39': 'https://assets.coingecko.com/coins/images/10103/thumb/HEX-logo.png?1575942673',
  // '0x2e703d658f8dd21709a7b458967ab4081f8d3d05': '',
  '0x429881672b9ae42b8eba0e26cd9c73711b891ca5': 'https://assets.coingecko.com/coins/images/12435/thumb/pickle_finance_logo.jpg?1599817746',
  '0x5dbcf33d8c2e976c6b560249878e6f1491bca25c': 'https://assets.coingecko.com/coins/images/12210/thumb/yUSD.png?1600166557',
  '0x6e36556b3ee5aa28def2a8ec3dae30ec2b208739': 'https://assets.coingecko.com/coins/images/12380/thumb/build.PNG?1599463828',
  '0x7865af71cf0b288b4e7f654f4f7851eb46a2b7f8': 'https://assets.coingecko.com/coins/images/7383/thumb/2x9veCp.png?1598409975',
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': 'https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110',
  '0x8ba6dcc667d3ff64c1a2123ce72ff5f0199e5315': 'https://assets.coingecko.com/coins/images/10972/thumb/ALEX.png?1586742545',
  '0xa0246c9032bc3a600820415ae600c6388619a14d': 'https://assets.coingecko.com/coins/images/12304/thumb/Harvest.png?1599007988',
  '0xc00e94cb662c3520282e6f5717214004a7f26888': 'https://assets.coingecko.com/coins/images/10775/thumb/COMP.png?1592625425',
  '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f': 'https://assets.coingecko.com/coins/images/3406/thumb/SNX.png?1598631139',
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1547036627',
  '0xd533a949740bb3306d119cc777fa900ba034cd52': 'https://assets.coingecko.com/coins/images/12124/thumb/Curve.png?1597369484',
  '0xe2f2a5c287993345a840db3b0845fbc70f5935a5': 'https://assets.coingecko.com/coins/images/11576/thumb/mStable_USD.png?1595591803'
}
