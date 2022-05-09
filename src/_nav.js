import React from 'react'

import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

import allTxIcon from 'src/assets/navBarIcons/dual-arrow-white.png'
import incomeTxIcon from 'src/assets/navBarIcons/income-arrow-white.png'
import expenseTxIcon from 'src/assets/navBarIcons/expense-arrow-white.png'
import untaggedTxIcon from 'src/assets/navBarIcons/untagged-tx-white.png'
import gasIcon from 'src/assets/navBarIcons/gas-white.png'
import csvIcon from 'src/assets/navBarIcons/csv-white.png'
import treasuryIcon from 'src/assets/navBarIcons/treasury-white.png'
import summaryIcon from 'src/assets/navBarIcons/summary-white.png'
import pnlIcon from 'src/assets/navBarIcons/pnl-white.png'
import projectionsIcon from 'src/assets/navBarIcons/projections-white.png'
import taxesIcon from 'src/assets/navBarIcons/taxes-white.png'

const _nav = [
  {
    component: CNavTitle,
    name: 'Transactions',
  },
  {
    component: CNavItem,
    name: 'All Transactions',
    to: '/mainpage',
    icon: <img src={allTxIcon} alt="income tx" className="navbarIcon" />,
  },
  {
    component: CNavItem,
    name: 'Income',
    to: '/income-txs',
    icon: <img src={incomeTxIcon} alt="income" className="navbarIcon" />,
  },
  {
    component: CNavItem,
    name: 'Expenses',
    to: '/expense-txs',
    icon: <img src={expenseTxIcon} alt="expenses" className="navbarIcon" />,
  },
  {
    component: CNavItem,
    name: 'Un-tagged',
    to: '/untagged-txs',
    icon: <img src={untaggedTxIcon} alt="untagged" className="navbarIcon" />,
  },
  {
    component: CNavTitle,
    name: 'Easy Pay',
  },
  {
    component: CNavItem,
    name: 'Contributor Gas Dues',
    to: '/contributor-gas-dues',
    icon: <img src={gasIcon} alt="Contributor gas" className="navbarIcon" />,
  },
  {
    component: CNavItem,
    name: 'Make Multisend CSV',
    to: '/make-multisend-csv',
    icon: <img src={csvIcon} alt="" className="navbarIcon" />,
  },
  {
    component: CNavTitle,
    name: 'Reports',
  },
  {
    component: CNavItem,
    name: 'Treasury',
    to: '/treasury',
    icon: <img src={treasuryIcon} alt="" className="navbarIcon" />,
  },
  {
    component: CNavItem,
    name: 'Summary',
    to: '/summary',
    icon: <img src={summaryIcon} alt="" className="navbarIcon" />,
  },
  {
    component: CNavItem,
    name: 'Profit & Loss',
    to: '/pnl',
    icon: <img src={pnlIcon} alt="" className="navbarIcon" />,
  },
  {
    component: CNavItem,
    name: 'Projections',
    to: '/projections',
    icon: <img src={projectionsIcon} alt="" className="navbarIcon" />,
  },
  {
    component: CNavItem,
    name: 'Taxes (v0.1)',
    to: '/taxes',
    icon: <img src={taxesIcon} alt="" className="navbarIcon" />,
  },
]

export default _nav
