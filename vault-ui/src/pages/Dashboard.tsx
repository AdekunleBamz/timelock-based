import { useState } from 'react';
import { useWallet } from '../hooks';
import { Tabs, TabPanel } from '../components/Tabs';
import { DataTable } from '../components/DataTable';
import { Pagination } from '../components/Pagination';
import { SearchInput } from '../components/SearchInput';
import { Section } from '../components/Section';
import { Grid } from '../components/Grid';
import { InfoBox } from '../components/InfoBox';
import { usePagination, useFilter } from '../hooks';
import './Dashboard.css';

interface DashboardPageProps {
  activeDeposits: number;
  totalLocked: string;
  unlockedCount: number;
}

export function DashboardPage({
  activeDeposits,
  totalLocked,
  unlockedCount,
}: DashboardPageProps) {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demo purposes
  const mockDeposits = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    amount: `${(Math.random() * 1000).toFixed(2)} USDC`,
    duration: `${Math.floor(Math.random() * 90)} days`,
    status: i % 3 === 0 ? 'Unlocked' : 'Active',
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  const { filtered } = useFilter(mockDeposits, {
    searchQuery,
    searchFields: ['amount', 'status'],
  });

  const pagination = usePagination({
    initialPageSize: 10,
    total: filtered.length,
  });

  const paginatedData = filtered.slice(
    pagination.startIndex,
    pagination.startIndex + pagination.pageSize
  );

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'duration', label: 'Duration' },
    { key: 'status', label: 'Status' },
    { key: 'timestamp', label: 'Created', sortable: true },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'deposits', label: 'Deposits', icon: '💰' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className="dashboard-page">
      <Section title="Vault Dashboard" subtitle="Monitor your locked deposits and earnings">
        <Grid columns={3} gap="md">
          <InfoBox
            icon="🔒"
            label="Total Locked"
            value={`$${totalLocked}`}
            variant="primary"
          />
          <InfoBox
            icon="📦"
            label="Active Deposits"
            value={activeDeposits.toString()}
            variant="info"
          />
          <InfoBox
            icon="✅"
            label="Ready to Withdraw"
            value={unlockedCount.toString()}
            variant="success"
          />
        </Grid>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} fullWidth />

        <TabPanel id="overview" activeTab={activeTab}>
          <Section title="Quick Stats">
            <p>Your wallet: {wallet.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'Not connected'}</p>
            <p>Network: {wallet.isCorrectChain ? 'Base' : 'Wrong Network'}</p>
          </Section>
        </TabPanel>

        <TabPanel id="deposits" activeTab={activeTab}>
          <Section title="All Deposits">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search deposits..."
            />
            <DataTable
              columns={columns}
              data={paginatedData}
              emptyMessage="No deposits found"
            />
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={pagination.goToPage}
            />
          </Section>
        </TabPanel>

        <TabPanel id="analytics" activeTab={activeTab}>
          <Section title="Analytics">
            <InfoBox
              label="Coming Soon"
              value="Advanced analytics and insights"
              variant="default"
            />
          </Section>
        </TabPanel>
      </Section>
    </div>
  );
}
