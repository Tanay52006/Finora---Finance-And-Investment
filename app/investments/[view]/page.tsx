import { InvestmentsPlatform } from '@/components/investments-platform'
import type { View } from '@/components/investments-platform'
export default async function InvestmentViewPage({ params }: { params: Promise<{ view: string }> }) { const { view } = await params; return <InvestmentsPlatform initialView={view as View} /> }
