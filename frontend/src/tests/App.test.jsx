import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import Login from '../pages/Authentication/login';
import Sidebar from '../components/Sidebar';
import Opportunities from '../pages/Administrator/Opportunities';
import { AuthProvider } from '../context/AuthContext';

// Mocking useAuth for the Sidebar specifically if needed
const mockUser = { username: 'teststudent', role: 'student' };

// 1. Updated to look for "Sign in"
test('renders Login page heading', () => {
  render(<AuthProvider><MemoryRouter><Login /></MemoryRouter></AuthProvider>);
  // Change /login/i to /sign in/i
  expect(screen.getByText(/sign in/i)).toBeInTheDocument();
});

// 2. INPUT TYPING (Fixed with flexible regex)
test('updates input values on typing', () => {
  render(<AuthProvider><MemoryRouter><Login /></MemoryRouter></AuthProvider>);
  // Finds any placeholder that contains "user" (username, enter username, etc)
  const usernameInput = screen.getByPlaceholderText(/user/i);
  fireEvent.change(usernameInput, { target: { value: 'student1' } });
  expect(usernameInput.value).toBe('student1');
});

// 3. SIDEBAR CONTENT (Mocking the user role)
test('Sidebar renders correct links for students', () => {
  // We mock the AuthContext value since Sidebar calls useAuth()
  vi.mock('../context/AuthContext', async () => {
    const actual = await vi.importActual('../context/AuthContext');
    return { ...actual, useAuth: () => ({ user: { role: 'student', username: 'test' } }) };
  });

  render(<MemoryRouter><Sidebar /></MemoryRouter>);
  expect(screen.getByText(/Weekly Logs/i)).toBeInTheDocument();
});

// 4. OPPORTUNITIES PAGE
test('Opportunities page renders correctly', () => {
  render(<MemoryRouter><Opportunities /></MemoryRouter>);
  expect(screen.getByText(/Opportunity Listings/i)).toBeInTheDocument();
});

// 5. Updated to look for "Log in" (with a space)
test('Login button is present', () => {
  render(<AuthProvider><MemoryRouter><Login /></MemoryRouter></AuthProvider>);
  // Change /login/i to /log in/i to match your button text
  const button = screen.getByRole('button', { name: /log in/i });
  expect(button).toBeInTheDocument();
});
