import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';

export type Category = 'Food' | 'Transport' | 'Rent' | 'Education' | 'Entertainment' | 'Healthcare' | 'Shopping' | 'Salary' | 'Investment';

export interface Transaction {
  id: string;
  date: Date;
  category: Category;
  amount: number;
  type: 'Income' | 'Expense';
  description: string;
}

export interface SpendingInsight {
  title: string;
  value: string;
  change: number;
  type: 'positive' | 'negative' | 'neutral';
}

const CATEGORIES: { name: Category; weight: number; type: 'Income' | 'Expense' }[] = [
  { name: 'Salary', weight: 1, type: 'Income' },
  { name: 'Investment', weight: 0.1, type: 'Income' },
  { name: 'Food', weight: 0.3, type: 'Expense' },
  { name: 'Transport', weight: 0.15, type: 'Expense' },
  { name: 'Rent', weight: 0.2, type: 'Expense' },
  { name: 'Education', weight: 0.1, type: 'Expense' },
  { name: 'Entertainment', weight: 0.1, type: 'Expense' },
  { name: 'Healthcare', weight: 0.05, type: 'Expense' },
  { name: 'Shopping', weight: 0.1, type: 'Expense' },
];

/**
 * Data Science Simulation: Generates synthetic transactions for analysis
 */
export function generateSyntheticData(days: number = 365): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = subDays(now, i);
    
    // Monthly Salary
    if (date.getDate() === 1) {
      transactions.push({
        id: `sal-${i}`,
        date,
        category: 'Salary',
        amount: 50000 + (Math.random() * 5000),
        type: 'Income',
        description: 'Monthly base salary'
      });
    }

    // Daily Expenses
    const numDailyTransactions = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numDailyTransactions; j++) {
      const catObj = CATEGORIES.filter(c => c.type === 'Expense')[Math.floor(Math.random() * 7)];
      const amount = Math.floor(Math.random() * 1000) * catObj.weight + 50;
      
      transactions.push({
        id: `tx-${i}-${j}`,
        date,
        category: catObj.name,
        amount,
        type: 'Expense',
        description: `${catObj.name} expense`
      });
    }
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}

/**
 * Aggregate data for Trends chart
 */
export function getMonthlyTrends(data: Transaction[]) {
  const months: Record<string, { month: string; Income: number; Expense: number }> = {};
  
  data.forEach(tx => {
    const monthKey = format(tx.date, 'MMM yyyy');
    if (!months[monthKey]) {
      months[monthKey] = { month: monthKey, Income: 0, Expense: 0 };
    }
    months[monthKey][tx.type] += tx.amount;
  });

  return Object.values(months).reverse();
}

/**
 * Aggregate data for Category Distribution
 */
export function getCategoryDistribution(data: Transaction[]) {
  const distribution: Record<string, number> = {};
  
  data.filter(tx => tx.type === 'Expense').forEach(tx => {
    distribution[tx.category] = (distribution[tx.category] || 0) + tx.amount;
  });

  return Object.entries(distribution).map(([name, value]) => ({ name, value }));
}

/**
 * Generate Insights using statistical analysis
 */
export function calculateInsights(data: Transaction[]): SpendingInsight[] {
  const currentMonth = new Date();
  const lastMonth = subDays(currentMonth, 30);
  
  const currentMonthExpenses = data
    .filter(tx => isSameMonth(tx.date, currentMonth) && tx.type === 'Expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const lastMonthExpenses = data
    .filter(tx => isSameMonth(tx.date, lastMonth) && tx.type === 'Expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const change = lastMonthExpenses === 0 ? 0 : ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

  return [
    {
      title: 'Monthly Burn Rate',
      value: `₹${currentMonthExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      change: parseFloat(change.toFixed(1)),
      type: change > 0 ? 'negative' : 'positive'
    },
    {
      title: 'Savings Rate',
      value: `${(( (currentMonthExpenses > 0 ? (50000 - currentMonthExpenses) / 50000 : 0) ) * 100).toFixed(1)}%`,
      change: 2.4,
      type: 'positive'
    },
    {
      title: 'Top Category',
      value: getCategoryDistribution(data).sort((a, b) => b.value - a.value)[0]?.name || 'N/A',
      change: 0,
      type: 'neutral'
    }
  ];
}
