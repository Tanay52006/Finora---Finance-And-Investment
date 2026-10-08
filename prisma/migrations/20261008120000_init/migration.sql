-- FINORA initial PostgreSQL migration
CREATE TYPE "TransactionType" AS ENUM ('INCOME','EXPENSE');
CREATE TYPE "AssetType" AS ENUM ('STOCK','MUTUAL_FUND','ETF','GOLD','FIXED_INCOME');
CREATE TYPE "InvestmentTransactionType" AS ENUM ('BUY','SELL','SIP','DIVIDEND');
CREATE TYPE "SipFrequency" AS ENUM ('WEEKLY','MONTHLY','QUARTERLY','YEARLY');
CREATE TYPE "SipStatus" AS ENUM ('ACTIVE','PAUSED','COMPLETED');
CREATE TYPE "NotificationType" AS ENUM ('BUDGET_ALERT','GOAL_PROGRESS','INVESTMENT_UPDATE','TRANSACTION','SYSTEM');

CREATE TABLE "User" (
 "id" TEXT NOT NULL,
 "name" TEXT NOT NULL,
 "email" TEXT NOT NULL,
 "passwordHash" TEXT NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Profile" (
 "id" TEXT NOT NULL,"userId" TEXT NOT NULL,"avatar" TEXT,
 "monthlyIncome" DECIMAL(18,2) NOT NULL DEFAULT 0,"monthlyExpense" DECIMAL(18,2) NOT NULL DEFAULT 0,
 "savingsGoal" DECIMAL(18,2) NOT NULL DEFAULT 0,"riskPreference" TEXT NOT NULL DEFAULT 'MODERATE',"currency" TEXT NOT NULL DEFAULT 'INR',
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

CREATE TABLE "FinancialAccount" (
 "id" TEXT NOT NULL,"userId" TEXT NOT NULL,"name" TEXT NOT NULL,"type" TEXT NOT NULL DEFAULT 'CASH',
 "balance" DECIMAL(18,2) NOT NULL DEFAULT 0,"currency" TEXT NOT NULL DEFAULT 'INR',
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "FinancialAccount_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "FinancialAccount_userId_idx" ON "FinancialAccount"("userId");

CREATE TABLE "Transaction" (
 "id" TEXT NOT NULL,"userId" TEXT NOT NULL,"accountId" TEXT,"type" "TransactionType" NOT NULL,
 "description" TEXT NOT NULL,"amount" DECIMAL(18,2) NOT NULL,"category" TEXT NOT NULL,"date" TIMESTAMP(3) NOT NULL,
 "notes" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Transaction_userId_date_idx" ON "Transaction"("userId","date");
CREATE INDEX "Transaction_userId_category_idx" ON "Transaction"("userId","category");

CREATE TABLE "Budget" (
 "id" TEXT NOT NULL,"userId" TEXT NOT NULL,"category" TEXT NOT NULL,"limit" DECIMAL(18,2) NOT NULL,
 "month" INTEGER NOT NULL,"year" INTEGER NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Budget_userId_category_month_year_key" ON "Budget"("userId","category","month","year");

CREATE TABLE "Goal" (
 "id" TEXT NOT NULL,"userId" TEXT NOT NULL,"name" TEXT NOT NULL,"targetAmount" DECIMAL(18,2) NOT NULL,
 "currentAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,"targetDate" TIMESTAMP(3) NOT NULL,"monthlyContribution" DECIMAL(18,2) NOT NULL DEFAULT 0,
 "category" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Goal_userId_idx" ON "Goal"("userId");

CREATE TABLE "Asset" (
 "id" TEXT NOT NULL,"symbol" TEXT NOT NULL,"name" TEXT NOT NULL,"type" "AssetType" NOT NULL,"exchange" TEXT,
 "description" TEXT,"price" DECIMAL(18,4) NOT NULL DEFAULT 0,"dayChange" DECIMAL(18,4) NOT NULL DEFAULT 0,
 "dayChangePercentage" DECIMAL(8,4) NOT NULL DEFAULT 0,"marketCap" TEXT,"peRatio" DECIMAL(10,2),
 "high52Week" DECIMAL(18,4),"low52Week" DECIMAL(18,4),"category" TEXT,"nav" DECIMAL(18,4),
 "return1Y" DECIMAL(8,4),"return3Y" DECIMAL(8,4),"return5Y" DECIMAL(8,4),"risk" TEXT,"expenseRatio" DECIMAL(8,4),
 "aum" TEXT,"fundManager" TEXT,"trackingIndex" TEXT,"isActive" BOOLEAN NOT NULL DEFAULT true,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Asset_symbol_key" ON "Asset"("symbol");

CREATE TABLE "Holding" (
 "id" TEXT NOT NULL,"userId" TEXT NOT NULL,"assetId" TEXT NOT NULL,"quantity" DECIMAL(18,6) NOT NULL,
 "averageBuyPrice" DECIMAL(18,4) NOT NULL,"currentPrice" DECIMAL(18,4) NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Holding_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Holding_userId_assetId_key" ON "Holding"("userId","assetId");
CREATE INDEX "Holding_userId_idx" ON "Holding"("userId");

CREATE TABLE "InvestmentTransaction" (
 "id" TEXT NOT NULL,"userId" TEXT NOT NULL,"assetId" TEXT NOT NULL,"type" "InvestmentTransactionType" NOT NULL,
 "quantity" DECIMAL(18,6) NOT NULL DEFAULT 0,"price" DECIMAL(18,4) NOT NULL DEFAULT 0,"amount" DECIMAL(18,2) NOT NULL,
 "date" TIMESTAMP(3) NOT NULL,"notes" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "InvestmentTransaction_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "InvestmentTransaction_userId_date_idx" ON "InvestmentTransaction"("userId","date");

CREATE TABLE "Watchlist" (
 "id" TEXT NOT NULL,"userId" TEXT NOT NULL,"assetId" TEXT NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Watchlist_userId_assetId_key" ON "Watchlist"("userId","assetId");

CREATE TABLE "Sip" (
 "id" TEXT NOT NULL,"userId" TEXT NOT NULL,"assetId" TEXT NOT NULL,"amount" DECIMAL(18,2) NOT NULL,
 "frequency" "SipFrequency" NOT NULL DEFAULT 'MONTHLY',"nextInvestmentDate" TIMESTAMP(3) NOT NULL,"status" "SipStatus" NOT NULL DEFAULT 'ACTIVE',
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "Sip_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Sip_userId_idx" ON "Sip"("userId");

CREATE TABLE "Dividend" (
 "id" TEXT NOT NULL,"userId" TEXT NOT NULL,"assetId" TEXT NOT NULL,"quantity" DECIMAL(18,6) NOT NULL,
 "dividendPerShare" DECIMAL(18,4) NOT NULL,"totalAmount" DECIMAL(18,2) NOT NULL,"exDate" TIMESTAMP(3) NOT NULL,
 "paymentDate" TIMESTAMP(3) NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Dividend_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Dividend_userId_paymentDate_idx" ON "Dividend"("userId","paymentDate");

CREATE TABLE "PortfolioSnapshot" (
 "id" TEXT NOT NULL,"userId" TEXT NOT NULL,"date" TIMESTAMP(3) NOT NULL,"value" DECIMAL(18,2) NOT NULL,"invested" DECIMAL(18,2) NOT NULL,
 CONSTRAINT "PortfolioSnapshot_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PortfolioSnapshot_userId_date_key" ON "PortfolioSnapshot"("userId","date");
CREATE INDEX "PortfolioSnapshot_userId_date_idx" ON "PortfolioSnapshot"("userId","date");

CREATE TABLE "Notification" (
 "id" TEXT NOT NULL,"userId" TEXT NOT NULL,"type" "NotificationType" NOT NULL,"title" TEXT NOT NULL,"message" TEXT NOT NULL,
 "read" BOOLEAN NOT NULL DEFAULT false,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Notification_userId_read_idx" ON "Notification"("userId","read");

CREATE TABLE "UserSettings" (
 "id" TEXT NOT NULL,"userId" TEXT NOT NULL,"currency" TEXT NOT NULL DEFAULT 'INR',"theme" TEXT NOT NULL DEFAULT 'system',
 "budgetAlerts" BOOLEAN NOT NULL DEFAULT true,"investmentUpdates" BOOLEAN NOT NULL DEFAULT true,"goalReminders" BOOLEAN NOT NULL DEFAULT true,
 "weeklySummary" BOOLEAN NOT NULL DEFAULT true,"updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FinancialAccount" ADD CONSTRAINT "FinancialAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "FinancialAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InvestmentTransaction" ADD CONSTRAINT "InvestmentTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InvestmentTransaction" ADD CONSTRAINT "InvestmentTransaction_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Sip" ADD CONSTRAINT "Sip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Sip" ADD CONSTRAINT "Sip_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Dividend" ADD CONSTRAINT "Dividend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Dividend" ADD CONSTRAINT "Dividend_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PortfolioSnapshot" ADD CONSTRAINT "PortfolioSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
