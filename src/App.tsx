import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreCtx, loadStore, saveStore } from './store';
import { Header, Footer, DashboardSidebar } from './components';
import { HomePage, CatalogPage, ProductPage, ConstructorPage, CartPage, AuthPage, ChatPage, EventsPage, B2BPage } from './pages-public';
import { DashboardOverview, DashboardOrders, DashboardProducts, DashboardRecipes, DashboardInventory, DashboardFinance, DashboardCustomers, DashboardProduction, DashboardUsers, DashboardFavorites, DashboardProfile, DashboardEvents, DashboardModeration, DashboardAnalytics, DashboardServices, DashboardVenues, DashboardDeliveries, DashboardTickets, DashboardSupport, DashboardSettings, ProjectsPage } from './pages-dashboard';

function AppRoutes() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  if (isDashboard) {
    return (
      <>
        <Header />
        <div className="flex flex-1 min-h-[calc(100vh-64px)]">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto bg-stone-50">
            <Routes>
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/dashboard/orders" element={<DashboardOrders />} />
              <Route path="/dashboard/products" element={<DashboardProducts />} />
              <Route path="/dashboard/recipes" element={<DashboardRecipes />} />
              <Route path="/dashboard/inventory" element={<DashboardInventory />} />
              <Route path="/dashboard/finance" element={<DashboardFinance />} />
              <Route path="/dashboard/customers" element={<DashboardCustomers />} />
              <Route path="/dashboard/production" element={<DashboardProduction />} />
              <Route path="/dashboard/users" element={<DashboardUsers />} />
              <Route path="/dashboard/favorites" element={<DashboardFavorites />} />
              <Route path="/dashboard/profile" element={<DashboardProfile />} />
              <Route path="/dashboard/events" element={<DashboardEvents />} />
              <Route path="/dashboard/moderation" element={<DashboardModeration />} />
              <Route path="/dashboard/analytics" element={<DashboardAnalytics />} />
              <Route path="/dashboard/services" element={<DashboardServices />} />
              <Route path="/dashboard/venues" element={<DashboardVenues />} />
              <Route path="/dashboard/deliveries" element={<DashboardDeliveries />} />
              <Route path="/dashboard/tickets" element={<DashboardTickets />} />
              <Route path="/dashboard/support" element={<DashboardSupport />} />
              <Route path="/dashboard/settings" element={<DashboardSettings />} />
            </Routes>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/constructor" element={<ConstructorPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/b2b" element={<B2BPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  const [store, setStoreState] = useState(loadStore);

  const setStore = (updater: (s: any) => any) => {
    setStoreState(prev => {
      const next = updater(prev);
      saveStore(next);
      return next;
    });
  };

  return (
    <StoreCtx.Provider value={{ store, setStore }}>
      <HashRouter>
        <div className="min-h-screen flex flex-col bg-stone-50">
          <AppRoutes />
        </div>
      </HashRouter>
    </StoreCtx.Provider>
  );
}

export default App;
