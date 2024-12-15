import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ClientLayout } from './components/client/ClientLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import ClientDashboard from './components/client/ClientDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/home/Hero';
import { MissionStatement } from './components/home/MissionStatement';
import { Services } from './components/home/Services';
import { CallToAction } from './components/home/CallToAction';
import { Footer } from './components/layout/Footer';
import { VisitorVisa } from './pages/services/VisitorVisa';
import { WorkPermit } from './pages/services/WorkPermit';
import { StudyPermit } from './pages/services/StudyPermit';
import { FamilyVisa } from './pages/services/FamilyVisa';
import { PermanentResidence } from './pages/services/PermanentResidence';
import { Naturalization } from './pages/services/Naturalization';
import { FamilySponsorship } from './pages/services/FamilySponsorship';
import { DocumentRenewal } from './pages/services/DocumentRenewal';
import { RelocationServices } from './pages/services/RelocationServices';
import { LegalServices } from './pages/services/LegalServices';
import { OtherServices } from './pages/services/OtherServices';
import { AboutUs } from './pages/AboutUs';
import { AssistancePayment } from './pages/AssistancePayment';
import { Contact } from './pages/Contact';
import { ScrollToTop } from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingSpinner } from './components/ui/loading-spinner';
import { NotFound } from './pages/NotFound';
import { ServicesPage } from './pages/services/index';

const { Suspense, lazy } = React;
const Evaluation = lazy(() => import('./pages/Evaluation'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const AdminClients = lazy(() => import('./components/admin/AdminClients'));
const AdminSetting = lazy(() => import('./components/admin/AdminSetting'));
const AdminUpdates = lazy(() => import('./components/admin/AdminUpdates'));
const ClientApplications = lazy(() => import('./components/client/ClientApplications'));
const ClientDocuments = lazy(() => import('./components/client/ClientDocuments'));
const ClientEvaluations = lazy(() => import('./components/client/ClientEvaluations'));
const ClientMessages = lazy(() => import('./components/client/ClientMessages'));
const ClientPayments = lazy(() => import('./components/client/ClientPayments'));
const AdminMessages = lazy(() => import('./components/admin/AdminMessages'));
const AdminEvaluations = lazy(() => import('./components/admin/AdminEvaluations'));
const ClientUpdates = lazy(() => import('./components/client/ClientUpdates'));

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
          </div>
        }>
          <Navbar />
          <div className="pt-20">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <>
                  <Hero />
                  <MissionStatement />
                  <Services />
                  <CallToAction />
                </>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected client routes */}
              <Route path="/client/*" element={
                <ProtectedRoute allowedRoles={['client', 'admin']}>
                  <ClientLayout />
                </ProtectedRoute>
              }>
                <Route index element={<ClientDashboard />} />
                <Route path="evaluations" element={<ClientEvaluations />} />
                <Route path="documents" element={<ClientDocuments />} />
                <Route path="messages" element={<ClientMessages />} />
                <Route path="payments" element={<ClientPayments />} />
                <Route path="applications" element={<ClientApplications />} />
                <Route path="updates" element={<ClientUpdates />} />
              </Route>

              {/* Protected admin routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="clients" element={<AdminClients />} />
                <Route path="evaluations" element={<AdminEvaluations />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="updates" element={<AdminUpdates />} />
                <Route path="settings" element={<AdminSetting />} />
              </Route>

              {/* Other routes */}
              <Route path="/evaluation" element={<Evaluation />} />
              <Route path="/services/visa-visiteur" element={<VisitorVisa />} />
              <Route path="/services/permis-de-travail" element={<WorkPermit />} />
              <Route path="/services/permis-etudes" element={<StudyPermit />} />
              <Route path="/services/super-visa-regroupement-familial" element={<FamilyVisa />} />
              <Route path="/services/residence-permanente" element={<PermanentResidence />} />
              <Route path="/services/naturalisation" element={<Naturalization />} />
              <Route path="/services/parrainage" element={<FamilySponsorship />} />
              <Route path="/services/renouvellement-documents" element={<DocumentRenewal />} />
              <Route path="/services/relocation" element={<RelocationServices />} />
              <Route path="/services/juridique" element={<LegalServices />} />
              <Route path="/services/autres" element={<OtherServices />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/pages/AssistancePayment" element={<AssistancePayment />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}