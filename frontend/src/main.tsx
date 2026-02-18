import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ProductDetailScreen } from './components/ProductDetailScreen.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { LoginScreen } from './components/SignIn.tsx';
import { RegisterScreen } from './components/Registers.tsx';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen.tsx';
import { ResetPasswordScreen } from './components/ResetPasswordScreen.tsx';
import { VerifyEmailScreen } from './components/VerifyEmailScreen.tsx';
import { ProductsScreen } from './components/ProductsScreen.tsx';
import { CategoriesScreen } from './components/CategoriesScreen.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { CreateProductScreen } from './components/CreateProductScreen.tsx';
import { CartScreen } from './components/CartScreen.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';

// Use environment variable for API URL, fallback to relative path for production
const API_URL = import.meta.env.VITE_API_URL || '/query';
const httpLink = new HttpLink({ uri: API_URL });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  // Public routes (accessible without sign-in)
  {
    path: "/signin",
    element: <LoginScreen />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/register",
    element: <RegisterScreen />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordScreen />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/reset-password",
    element: <ResetPasswordScreen />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/verify-email",
    element: <VerifyEmailScreen />,
    errorElement: <ErrorBoundary />
  },
  // Protected routes (require sign-in)
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/products/:id",
        element: <ProductDetailScreen />,
      },
      {
        path: "/create-product",
        element: <CreateProductScreen />,
      },
      {
        path: "/products",
        element: <ProductsScreen />,
      },
      {
        path: "/categories",
        element: <CategoriesScreen />,
      },
      {
        path: "/cart",
        element: <CartScreen />,
      },
      {
        path: "*",
        element: <App />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>,
)
