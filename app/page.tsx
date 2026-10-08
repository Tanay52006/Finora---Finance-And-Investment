'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiDelete, apiGet, apiPost } from '@/lib/api'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  ChevronDown,
  CircleHelp,
  CreditCard,
  FileText,
  Grid2X2,
  Layers3,
  LogOut,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Wallet,
  X,
} from 'lucide-react'

const navGroups = [
  { label: 'MAIN MENU', items: [{ label: 'Dashboard', icon: Grid2X2 }, { label: 'Analytics', icon: BarChart3, count: '20' }, { label: 'Investments', icon: BarChart3 }, { label: 'Transactions', icon: CreditCard }, { label: 'Invoices', icon: FileText }] },
  { label: 'FEATURES', items: [{ label: 'Recurring', icon: Layers3, count: '16' }, { label: 'Feedback', icon: CircleHelp }] },
  { label: 'GENERAL', items: [{ label: 'Settings', icon: Settings }, { label: 'Help Desk', icon: CircleHelp }, { label: 'Log out', icon: LogOut }] },
]

const currencies = [
  { flag: '🇺🇸', name: 'USD', amount: '$22,678.00', limit: 'Limit is $10k a month', active: true },
  { flag: '🇩🇪', name: 'EUR', amount: '€18,345.00', limit: 'Limit is €8k a month', active: true },
  { flag: '🇧🇩', name: 'BDT', amount: '৳1,22,678.00', limit: 'Limit is ৳10k a month', active: true },
  { flag: '🇬🇧', name: 'GBP', amount: '£15,000.00', limit: 'Limit is £7.5k a month', active: false },
]

const activities = [
  { name: 'Software License', id: 'INV_000076', date: '17 Apr, 2026', time: '03:45 PM', price: '$25,500', status: 'Completed', color: 'green' },
  { name: 'Flight Ticket', id: 'INV_000075', date: '16 Apr, 2026', time: '11:20 AM', price: '$22,750', status: 'Pending', color: 'orange' },
  { name: 'Office Supplies', id: 'INV_000074', date: '14 Apr, 2026', time: '09:15 AM', price: '$8,420', status: 'Completed', color: 'green' },
]

const bars = [45, 38, 72, 42, 57, 27, 50]
type FinanceEntry = { id: string; description: string; type: 'INCOME' | 'EXPENSE'; amount: number; category: string; date: string }
type DashboardSummary = { totalBalance:number; totalIncome:number; totalExpenses:number; totalSavings:number; netWorth:number; savingsRate:number }

function Logo() {
  return <div className="brand"><div className="brand-mark"><ArrowUpRight /></div><span>FINORA</span></div>
}

export default function Page() {
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [range, setRange] = useState('This Month')
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [entryType, setEntryType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE')
  const [entries, setEntries] = useState<FinanceEntry[]>([])
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [entrySearch, setEntrySearch] = useState('')
  const [loadingData, setLoadingData] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [entryName, setEntryName] = useState('')
  const [entryAmount, setEntryAmount] = useState('')
  const [entryCategory, setEntryCategory] = useState('General')
  const [showSearch, setShowSearch] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [chartMode, setChartMode] = useState<'Yearly' | 'Monthly'>('Yearly')
  const [chartBars, setChartBars] = useState(bars)
  const router = useRouter()
  const goTo = (label: string) => router.push(label === 'Dashboard' ? '/' : `/${label.toLowerCase().replaceAll(' ', '-')}`)
  const filteredEntries = useMemo(() => entries.filter((entry) => `${entry.description} ${entry.category} ${entry.type}`.toLowerCase().includes(entrySearch.toLowerCase())), [entries, entrySearch])
  const balance = summary?.totalBalance ?? 0
  useEffect(() => { (async () => { try { const [t,s] = await Promise.all([apiGet<{items:FinanceEntry[]}>('/api/transactions?limit=50'), apiGet<DashboardSummary>('/api/dashboard/summary')]); setEntries(t.items); setSummary(s); } catch (e:any) { if (e.status === 401) router.push('/login'); else setLoadError(e.message || 'Unable to load your financial data.') } finally { setLoadingData(false) } })() }, [router])
  const addEntry = async () => { const amount = Number(entryAmount); if (!entryName.trim() || !Number.isFinite(amount) || amount <= 0) return; try { const tx = await apiPost<FinanceEntry>('/api/transactions',{type:entryType,description:entryName.trim(),amount,category:entryCategory,date:new Date().toISOString()}); setEntries(c => [tx,...c]); const s=await apiGet<DashboardSummary>('/api/dashboard/summary'); setSummary(s); setEntryName(''); setEntryAmount(''); setShowAdd(false) } catch(e:any){ setLoadError(e.message || 'Unable to save transaction.') } }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Logo />
        <button className="search-button" onClick={() => setShowSearch(!showSearch)}><Search /><span>Search</span><kbd>⌘ K</kbd></button>{showSearch && <div className="search-popover"><Search /><input autoFocus placeholder="Search your finances" value={entrySearch} onChange={(event) => setEntrySearch(event.target.value)} /><button onClick={() => { setEntrySearch(''); setShowSearch(false) }}><X /></button></div>}
        <nav className="side-nav" aria-label="Main navigation">
          {navGroups.map((group) => <div className="nav-group" key={group.label}>
            <p className="nav-label">{group.label}</p>
            {group.items.map(({ label, icon: Icon, count }) => <button key={label} onClick={() => { setActiveNav(label); if (label === 'Log out') { apiPost('/api/auth/logout', {}).then(() => router.push('/login')) } else goTo(label) }} className={`nav-item ${activeNav === label ? 'active' : ''}`}><Icon /><span>{label}</span>{count && <small>{count}</small>}</button>)}
          </div>)}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="breadcrumbs"><button aria-label="Back"><ArrowLeft /></button><button aria-label="Forward"><ArrowRight /></button><span>FINORA</span><b>›</b><strong>{activeNav}</strong></div>
          <div className="top-actions">
            <button className="icon-button" onClick={() => setShowHelp(!showHelp)} aria-label="Open help"><CircleHelp /></button>
            <button className="icon-button" onClick={() => goTo('Invoices')} aria-label="Open invoices"><FileText /></button>
            <button className="icon-button" onClick={() => setShowNotifications(!showNotifications)}><Bell /></button>
            <button className="profile-trigger" onClick={() => setShowProfile(!showProfile)}><span className="avatar">TS</span><ChevronDown /></button>
            <button className="share-button">Share <ArrowUpRight /></button>
          </div>
          {showNotifications && <div className="popover notification-popover"><strong>Notifications</strong><p>Your monthly report is ready.</p><p>New invoice successfully paid.</p></div>}{showHelp && <div className="popover help-popover"><strong>Need help?</strong><p>Review your finances or open the Help Desk for support.</p><button onClick={() => goTo('Help Desk')}>Open Help Desk</button></div>}
          {showProfile && <div className="popover profile-popover"><strong>Tanay Sharma</strong><span>tanay@oripiofin.com</span><button onClick={() => goTo('Settings')}>View profile</button></div>}
        </header>

        <div className="content">
          {loadError && <div className="panel" style={{marginBottom:16,padding:14,color:"#9f1239"}}>{loadError} <button onClick={()=>location.reload()}>Try again</button></div>}
          <div className="page-heading"><div><h1>Overview</h1><p>Here is the summary of overall data</p></div><div className="heading-actions"><button className="select-button" onClick={() => setRange(range === 'This Month' ? 'Last Month' : 'This Month')}>{range}<ChevronDown /></button><button className="reset-button" onClick={() => { setRange('This Month'); setChartMode('Yearly'); setChartBars(bars) }}><RefreshCw /> Reset Data</button></div></div>

          <div className="summary-grid">
            <article className="summary-card balance-card"><div className="card-top"><div className="card-icon light"><Wallet /></div><div><h3>My balance</h3><p>Wallet Overview & Spending</p></div><MoreHorizontal /></div><div className="summary-amount">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })} <span>+1.5% ↑</span></div><button className="card-footer" onClick={() => goTo('Transactions')}>See details <ArrowRight /></button></article>
            <article className="summary-card"><div className="card-top"><div className="card-icon purple"><CreditCard /></div><div><h3>Savings account</h3><p>Steady Growth Savings</p></div><MoreHorizontal /></div><div className="summary-amount dark">₹{(summary?.totalSavings ?? 0).toLocaleString('en-IN')} <span>+3.2% ↑</span></div><button className="card-footer" onClick={() => goTo('Analytics')}>View summary <ArrowRight /></button></article>
            <article className="summary-card"><div className="card-top"><div className="card-icon lilac"><BarChart3 /></div><div><h3>Investment portfolio</h3><p>Track Your Wealth Growth</p></div><MoreHorizontal /></div><div className="summary-amount dark">₹{(summary?.netWorth ?? 0).toLocaleString('en-IN')} <span>+4.7% ↑</span></div><button className="card-footer" onClick={() => goTo('Analytics')}>Analyze performance <ArrowRight /></button></article>
          </div>

          <div className="middle-grid">
            <article className="panel wallet-panel"><div className="panel-heading"><div><h2>My Wallet</h2><p>Today 1 USD = 122.20 BDT</p></div><button className="outline-button" onClick={() => setShowAdd(true)}><Plus /> Add New</button></div><div className="currency-grid">{currencies.map((currency) => <div className="currency-card" key={currency.name}><div className="currency-head"><span>{currency.flag} {currency.name}</span><MoreHorizontal /></div><strong>{currency.amount}</strong><small>{currency.limit}</small><em className={currency.active ? '' : 'inactive'}>{currency.active ? 'Active' : 'Inactive'}</em></div>)}</div></article>
            <article className="panel cash-panel"><div className="panel-heading"><div><h2>Cash Flow</h2><strong className="cash-total">{chartMode === 'Monthly' ? '$186,420.18' : '$342,323.44'}</strong></div><div className="chart-toggle"><button className={chartMode === 'Monthly' ? 'selected' : ''} onClick={() => { setChartMode('Monthly'); setChartBars([35, 58, 44, 67, 39, 52, 61]) }}>Monthly</button><button className={chartMode === 'Yearly' ? 'selected' : ''} onClick={() => { setChartMode('Yearly'); setChartBars(bars) }}>• Yearly</button></div></div><div className="chart-area"><div className="y-axis"><span>50k</span><span>40k</span><span>30k</span><span>20k</span><span>10k</span><span>0k</span></div><div className="bars">{chartBars.map((height, index) => <div className="bar-column" key={index}><div className={`bar ${index === 2 ? 'highlight' : ''}`} style={{ height: `${height * 2.2}px` }}>{index === 2 && <div className="tooltip"><b>July 23, 2026</b><span>Cashflow <strong>$33,847.00</strong></span><span>Inflow <strong>-$7,456.00</strong></span></div>}</div><label>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][index]}</label></div>)}</div></div></article>
          </div>

          <article className="panel activities-panel"><div className="panel-heading"><div><h2>Recent Activities</h2></div><div className="table-actions"><div className="table-search"><Search /><input placeholder="Search" value={entrySearch} onChange={(event) => setEntrySearch(event.target.value)} /></div><button className="filter-button" onClick={() => setEntrySearch(entrySearch ? '' : 'EXPENSE')}><SlidersHorizontal /> Filter</button></div></div><div className="table-wrap"><table><thead><tr><th><input type="checkbox" aria-label="Select all" /></th><th>Activity</th><th>Order ID</th><th>Date</th><th>Time</th><th>Price</th><th>Status</th><th /></tr></thead><tbody>{filteredEntries.map((item) => <tr key={item.id}><td><input type="checkbox" aria-label={`Select ${item.description}`} /></td><td><span className="activity-icon"><FileText /></span>{item.description}</td><td>{item.category}</td><td>{new Date(item.date).toLocaleDateString('en-IN')}</td><td>Recorded</td><td className={item.type === 'INCOME' ? 'income-text' : 'expense-text'}>{item.type === 'INCOME' ? '+' : '-'}₹{item.amount.toLocaleString('en-IN')}</td><td><span className="status green"><i />Recorded</span></td><td><button aria-label={`Remove ${item.description}`} onClick={async () => { try { await apiDelete(`/api/transactions/${item.id}`); setEntries(current => current.filter(entry => entry.id !== item.id)); setSummary(await apiGet<DashboardSummary>('/api/dashboard/summary')) } catch(e:any) { setLoadError(e.message || 'Unable to delete transaction.') } }}><X /></button></td></tr>)}</tbody></table></div></article>
        </div>
      </section>
      {showAdd && <div className="modal-backdrop" onClick={() => setShowAdd(false)}><div className="modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setShowAdd(false)}><X /></button><Sparkles /><h2>Add personal finance</h2><p>Record income or an expense and update your balance.</p><div className="entry-toggle"><button className={entryType === 'INCOME' ? 'selected' : ''} onClick={() => setEntryType('Income')}>Income</button><button className={entryType === 'Expense' ? 'selected' : ''} onClick={() => setEntryType('Expense')}>Expense</button></div><input placeholder="Description" value={entryName} onChange={(event) => setEntryName(event.target.value)} /><input type="number" min="0" placeholder="Amount" value={entryAmount} onChange={(event) => setEntryAmount(event.target.value)} /><select value={entryCategory} onChange={(event) => setEntryCategory(event.target.value)}><option>General</option><option>Salary</option><option>Housing</option><option>Food</option><option>Travel</option><option>Business</option></select><button className="primary-action" onClick={addEntry}>Save {entryType === 'INCOME' ? 'income' : 'expense'}</button></div></div>}
    </main>
  )
}
