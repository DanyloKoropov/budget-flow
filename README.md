# BudgetFlow

A polished personal budget planner built with React, Vite, React Router, Context API, LocalStorage, Recharts, and React Hook Form.

BudgetFlow is a polished personal budget planner built with React, Vite, React Router, Context API, LocalStorage, Recharts, React Hook Form, and regular CSS. It is designed as a portfolio-ready continuation of the same React app style as ProjectFlow and Nova Store, but focused on personal finance planning.

## Features

- Dashboard with balance, income, expenses, and budget insights
- Transaction management with add, edit, delete, details, search, filters, and sorting
- Monthly budgeting with progress tracking and over-budget states
- Savings goals with contribution support and progress bars
- Light and dark theme switching
- LocalStorage persistence for transactions, budgets, goals, and settings
- Responsive layout for desktop, tablet, and mobile

## Tech Stack

- React
- Vite
- JavaScript
- React Router
- Context API
- React Hook Form
- Recharts
- date-fns
- Lucide React
- CSS variables and reusable components

## Installation

```bash
npm install
```

## Commands

```bash
npm run dev
npm run build
npm run lint
```

## Folder Overview

- src/components: reusable UI and feature-specific components
- src/context: shared state providers for transactions, budgets, goals, and settings
- src/pages: route-level pages for dashboard, transactions, budgets, goals, and settings
- src/utils: finance, formatting, date, and ID helpers
- src/data: demo data for the first-run experience

## Financial Calculations

BudgetFlow uses shared utility functions for balance, monthly income and expenses, remaining budget, budget usage percentages, goal progress, filtering, sorting, and currency formatting. These are centralized in the utils layer so the same calculations are reused by the dashboard and related screens.

## Responsive Design

The UI adapts to desktop, tablet, and mobile widths with a collapsible sidebar, stacked cards, and mobile-friendly forms and lists.

## Future Improvements

Possible next steps include authentication, recurring transactions, CSV import/export, richer analytics, and multi-currency conversion.

## Author

Danylo
