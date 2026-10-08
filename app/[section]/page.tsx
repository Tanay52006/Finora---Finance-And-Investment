import Link from 'next/link'
import { ArrowLeft, ArrowRight, BarChart3, CheckCircle2, CreditCard, FileText, Grid2X2, Layers3, Plus, Settings } from 'lucide-react'

const pageData: Record<string, { title: string; description: string; icon: typeof Grid2X2; items: string[] }> = {
  analytics: { title: 'Analytics', description: 'Understand where your money is going and how it is growing.', icon: BarChart3, items: ['Monthly revenue', 'Spending categories', 'Portfolio performance', 'Cash flow forecast'] },
  transactions: { title: 'Transactions', description: 'Review and manage every incoming and outgoing payment.', icon: CreditCard, items: ['Software License · $25,500', 'Flight Ticket · $22,750', 'Office Supplies · $8,420', 'Team Lunch · $1,280'] },
  invoices: { title: 'Invoices', description: 'Create, send, and track invoices from one place.', icon: FileText, items: ['INV_000076 · Paid', 'INV_000075 · Pending', 'INV_000074 · Paid', 'INV_000073 · Draft'] },
  recurring: { title: 'Recurring', description: 'Keep subscriptions and scheduled payments organized.', icon: Layers3, items: ['Cloud hosting · Monthly', 'Design tools · Yearly', 'Payroll · Monthly', 'Insurance · Quarterly'] },
  feedback: { title: 'Feedback', description: 'Share feedback and keep your account support history in one place.', icon: CheckCircle2, items: ['Product feedback', 'Support requests', 'Feature requests', 'Resolved conversations'] },
  settings: { title: 'Settings', description: 'Manage your profile, workspace, and notification preferences.', icon: Settings, items: ['Profile details', 'Security', 'Notifications', 'Workspace preferences'] },
  help: { title: 'Help Desk', description: 'Find answers or start a conversation with the support team.', icon: CheckCircle2, items: ['Getting started', 'Wallet questions', 'Billing support', 'Contact support'] },
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  const data = pageData[section] ?? pageData.analytics
  const Icon = data.icon
  return (
    <main className="app-shell">
      <aside className="sidebar"><div className="brand"><div className="brand-mark"><ArrowRight /></div><span>FINORA</span></div><nav className="side-nav"><div className="nav-group"><p className="nav-label">WORKSPACE</p><Link className="nav-item" href="/"><Grid2X2 /><span>Dashboard</span></Link>{Object.entries(pageData).slice(0, 5).map(([key, item]) => <Link key={key} className={`nav-item ${key === section ? 'active' : ''}`} href={`/${key}`}><item.icon /><span>{item.title}</span></Link>)}</div></nav></aside>
      <section className="workspace"><header className="topbar"><div className="breadcrumbs"><Link href="/" className="breadcrumbs button"><ArrowLeft /></Link><span>FINORA</span><b>›</b><strong>{data.title}</strong></div><div className="top-actions"><Link className="share-button" href="/">Back to dashboard <ArrowRight /></Link></div></header><div className="content"><div className="page-heading"><div><h1>{data.title}</h1><p>{data.description}</p></div><Link className="share-button" href="/investments"><Plus /> New</Link></div><div className="section-hero"><div className="card-icon light"><Icon /></div><div><h2>{data.title} workspace</h2><p>Your latest account information is ready to review.</p></div></div><div className="detail-grid">{data.items.map((item, index) => <Link className="panel detail-card" key={item} href={section === 'transactions' ? '/transactions' : section === 'analytics' ? '/analytics' : '/investments'}><div className="detail-icon"><Icon /></div><div><strong>{item}</strong><p>{index % 2 === 0 ? 'Updated today' : 'Needs your attention'}</p></div><ArrowRight /></Link>)}</div></div></section>
    </main>
  )
}
