import '@fontsource/poppins'; // Defaults to weight 400
import { React, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// Core & Layout components (kept synchronous as they are essential for initial load)
import ProtectedRoute from './components/auth/protected-route';
import PublicRoute from './components/auth/public-route';
import LandingLayout from './components/layouts/landing-layout';
import DashboardLayout from './components/layouts/dashboard-layout';
import GlobalLoader from './components/shared/global-loader';
import useTokenRefresher from './hooks/useTokenRefresh';

// Lazy loaded pages
const Login = lazy(() => import('./pages/auth/login'));
const ForgotPassword = lazy(() => import('./pages/auth/forgot-password'));
const Admin = lazy(() => import('./pages/admin/admin'));
const SignupPage = lazy(() => import('./pages/auth/signup-page'));
const VerifyOTPPage = lazy(() => import('./pages/auth/verify-otp-page'));
const ProfilePage = lazy(() => import('./pages/user/onboarding/link-in-bio/profile-page'));
const LinksPage = lazy(() => import('./pages/user/onboarding/link-in-bio/links-page'));
const TemplatePage = lazy(() => import('./pages/user/onboarding/link-in-bio/template-page'));
const PricingPage = lazy(() => import('./pages/user/onboarding/pricing-page'));
const ChangePlan = lazy(() => import('./pages/user/change-plan'));
const SlugPage = lazy(() => import('./pages/user/onboarding/slug-page'));
const PaymentSuccessPage = lazy(() => import('./pages/user/onboarding/payment-success-page'));
const PaymentCancelPage = lazy(() => import('./pages/user/onboarding/payment-cancel-page'));
const GoalPage = lazy(() => import('./pages/user/onboarding/goal-page'));
const NotFound = lazy(() => import('./pages/not-found'));
const CategoryPage = lazy(() => import('./pages/user/onboarding/category-page'));
const ModuleSelectionPage = lazy(() => import('./pages/user/onboarding/module-selection-page'));
const DCIdentityPage = lazy(() => import('./pages/user/onboarding/digital-card/identity-page'));
const DCContactPage = lazy(() => import('./pages/user/onboarding/digital-card/contact-page'));
const DCSocialPage = lazy(() => import('./pages/user/onboarding/digital-card/social-page'));
const DCTemplatePage = lazy(() => import('./pages/user/onboarding/digital-card/template-page'));
const UserProfile = lazy(() => import('./pages/user/link-in-bio/user-profile'));
const AdminLogin = lazy(() => import('./pages/admin/admin-login'));
const AdminProtectedRoute = lazy(() => import('./components/auth/admin-protected-route'));
const Terms = lazy(() => import('./pages/terms'));
const Privacy = lazy(() => import('./pages/privacy'));
const Contact = lazy(() => import('./pages/auth/contact'));
const WebLinqoLanding = lazy(() => import('./pages/user/landing-page'));
const LandingPricingPage = lazy(() => import('./pages/user/landing-page/pricing'));
const TemplatesPage = lazy(() => import('./pages/user/landing-page/templates'));

// Dashboard pages
const DCLinksPage = lazy(() => import('./pages/user/digital-card/links-page'));
const DCAppearancePage = lazy(() => import('./pages/user/digital-card/appearance-page'));
const DCAnalyticsPage = lazy(() => import('./pages/user/digital-card/analytics-page'));
const SettingsPage = lazy(() => import('./pages/user/settings-page'));
const DigitalCardWrapper = lazy(() => import('./components/user/digital-card/digital-card-wrapper'));
const LinkInBioWrapper = lazy(() => import('./components/user/link-in-bio/link-in-bio-wrapper'));
const DigitalCardTemp = lazy(() => import('./pages/user/landing-page/digital-card'));
const DCUserProfile = lazy(() => import('./pages/user/digital-card/user-profile'));
const AccountPage = lazy(() => import('./pages/user/account-page'));
const PaymentPage = lazy(() => import('./pages/payment-page'));
const About = lazy(() => import('./pages/user/about-us'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-offWhite">
    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-primary"></div>
  </div>
);

function App() {
  // Initialize token refresh hook for automatic token management
  useTokenRefresher();
  
  return (
    <>
      <GlobalLoader />
      <Toaster position="top-center" />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing Layout Routes */}
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<WebLinqoLanding />} />
            <Route path="pricing" element={<LandingPricingPage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="terms" element={<Terms />} />
            <Route path="digital-card-templates" element={<DigitalCardTemp />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="signup" element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } />
            <Route path="login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            <Route path="verify" element={<VerifyOTPPage />} />
          </Route>

          {/* Dashboard Layout Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<LinkInBioWrapper />} />
            <Route path="appearance" element={<LinkInBioWrapper />} />
            <Route path="analytics" element={<LinkInBioWrapper />} />
            <Route path="settings" element={<SettingsPage />} />
            
            {/* Digital Card Routes */}
            <Route path="digital-card" element={<DigitalCardWrapper />}>
              <Route index element={<DCLinksPage />} />
              <Route path="links" element={<DCLinksPage />} />
              <Route path="appearance" element={<DCAppearancePage />} />
              <Route path="analytics" element={<DCAnalyticsPage />} />
            </Route>
          </Route>

          {/* Module Selection Route */}
          <Route path="/onboarding/module-selection" element={
            <ProtectedRoute>
              <ModuleSelectionPage />
            </ProtectedRoute>
          } />

          {/* Digital Card Onboarding Routes */}
          <Route path="/onboarding/card-identity" element={
            <ProtectedRoute>
              <DCIdentityPage />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/card-contact" element={
            <ProtectedRoute>
              <DCContactPage />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/card-social-web" element={
            <ProtectedRoute>
              <DCSocialPage />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/card-template" element={
            <ProtectedRoute>
              <DCTemplatePage />
            </ProtectedRoute>
          } />

          {/* Link-in-Bio Onboarding Routes */}
          <Route path="/onboarding/slug" element={
            <ProtectedRoute>
              <SlugPage />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/goal" element={
            <ProtectedRoute>
              <GoalPage />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/category" element={
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/pricing" element={
            <ProtectedRoute>
              <PricingPage />
            </ProtectedRoute>
          } />
          <Route path="/change-plan" element={
            <ProtectedRoute>
              <ChangePlan />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/template" element={
            <ProtectedRoute>
              <TemplatePage />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/links" element={
            <ProtectedRoute>
              <LinksPage />
            </ProtectedRoute>
          } />
          <Route path="/onboarding/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/account" element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          } />
          <Route path="/payment-card" element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          } />

          {/* Public Routes */}
          <Route path="/link/:slug" element={<UserProfile />} />
          <Route path="/card/:slug" element={<DCUserProfile />} />

          {/* Payment Routes */}
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/cancel" element={<PaymentCancelPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <Admin />
            </AdminProtectedRoute>
          } />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
