import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../shared/components/layout/ProtectedRoute';
import { AdminRoute } from '../shared/components/layout/AdminRoute';
import { AuthContext } from '../shared/context/AuthContext';

const renderWithContext = (ui, authValue, initialRoute = '/') => {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/customer-only" element={<ProtectedRoute><div>Customer Content</div></ProtectedRoute>} />
          <Route path="/admin-only" element={<AdminRoute><div>Admin Content</div></AdminRoute>} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    renderWithContext(<div>Customer Content</div>, { user: null, loading: false }, '/customer-only');
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Customer Content')).not.toBeInTheDocument();
  });

  it('renders content when authenticated', () => {
    renderWithContext(<div>Customer Content</div>, { user: { uid: '123' }, loading: false }, '/customer-only');
    expect(screen.getByText('Customer Content')).toBeInTheDocument();
  });
});

describe('AdminRoute', () => {
  it('redirects to /login when not authenticated', () => {
    renderWithContext(<div>Admin Content</div>, { user: null, loading: false, isAdmin: false }, '/admin-only');
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to / when authenticated but not admin', () => {
    renderWithContext(<div>Admin Content</div>, { user: { uid: '123' }, loading: false, isAdmin: false }, '/admin-only');
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders content when authenticated as admin', () => {
    renderWithContext(<div>Admin Content</div>, { user: { uid: '123', role: 'admin' }, loading: false, isAdmin: true }, '/admin-only');
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
});
