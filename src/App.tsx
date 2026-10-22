import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header, Footer, DashboardSidebar } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductPage } from './pages/ProductPage';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProductsPage } from './pages/ProductsPage';
import { RecipesPage } from './pages/RecipesPage';
import { InventoryPage } from './pages/InventoryPage';
import { CustomersPage } from './pages/CustomersPage';
import { FinancePage } from './pages/FinancePage';
import { B2BPage } from './pages/B2BPage';
import { EventPlannerPage } from './pages/EventPlannerPage';
import { ChatPage } from './pages/ChatPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { AuthPage } from './pages/AuthPage';
import { CartPage } from './pages/CartPage';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto bg-cream/50">
        {children}
      </main>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {isDashboard ? (
          <DashboardLayout>
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/orders" element={<OrdersPage />} />
              <Route path="/dashboard/products" element={<ProductsPage />} />
              <Route path="/dashboard/recipes" element={<RecipesPage />} />
              <Route path="/dashboard/inventory" element={<InventoryPage />} />
              <Route path="/dashboard/customers" element={<CustomersPage />} />
              <Route path="/dashboard/finance" element={<FinancePage />} />
              <Route path="/dashboard/ai" element={<AIAssistantPage />} />
            </Routes>
          </DashboardLayout>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/b2b" element={<B2BPage />} />
            <Route path="/events" element={<EventPlannerPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        )}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
