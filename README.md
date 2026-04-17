# FinSight: Expense Analytics Dashboard (Data Science Project)

## 📌 Project Overview
**Objective:** To build a data-driven application that enables users to track, categorize, and visualize expenses, providing financial insights through statistical simulations.

This project demonstrates the application of **Data Science** principles (Data Cleaning, Aggregation, Trend Analysis, and Visualization) in a modern web environment.

---

## 🛠️ Tech Stack
- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS (Modern Utility-First)
- **Visualization:** Recharts (SVG-based Data Viz)
- **Data Engine:** Custom Synthetic Data Simulator
- **Icons:** Lucide React

---

## 📊 Data Science Workflow
1. **Data Generation:** Uses a weighted probability engine to simulate realistic spending behavior over a 365-day interval.
2. **Preprocessing:** Standardizes categories and handles timestamp normalization.
3. **Exploratory Data Analysis (EDA):**
   - **Monthly Trends:** Aggregates totals to identify seasonality in spending.
   - **Category Distribution:** Uses proportional analysis to identify major cost centers.
   - **Financial Metrics:** Calculates Savings Ratio and Monthly Burn Rate.
4. **Insights Generation:** Comparative analysis (Month-over-Month) to detect spending anomalies.

---

## 🚀 Key Features
- **Real-time Simulation:** Generate new datasets with one click to see how trends shift.
- **Interactive Dashboards:** Area charts and Pie charts for holistic views.
- **Search & Filter:** Find specific transactions within thousands of simulated entries.
- **Mobile Responsive:** Accessible on all device sizes.

---

## 💡 Interview Preparation (Top 5 Questions)
1. **Q: How do you handle missing or noisy data in this app?**
   - *A:* We use normalization layers in our data utilities to ensure every transaction has a valid date and numeric amount before it hits the charting engine.
2. **Q: Why use Recharts for visualization?**
   - *A:* Recharts is built on D3 components but optimized for React's lifecycle, ensuring that updates to the underlying data reflect instantly in the UI with smooth animations.
3. **Q: How would you scale this to real bank data?**
   - *A:* I would integrate an API like Plaid or Salt Edge to ingest real CSV/ISO-20022 formats, then apply the same cleaning and aggregation logic used in the synthetic engine.
4. **Q: What is the most important financial metric here?**
   - *A:* The **Savings Ratio**. It's the ultimate indicator of financial health, showing what percentage of income remains after all categorized expenses.
5. **Q: How did you ensure the simulation was realistic?**
   - *A:* I implemented weighted categories (e.g., Rent is high weight but low frequency, Food is low weight but high frequency) to mimic actual human behavior.

---

## 📈 Future Roadmap
- [ ] **AI Spending Predictions:** Use simple regression to predict next month's bills.
- [ ] **Budget Alerts:** Notifications when a category exceeds its monthly quota.
- [ ] **Export to PDF:** Professional PDF reports for business users.

---
*Developed as part of a Data Science Portfolio for FinTech roles.*
