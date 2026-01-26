import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";

import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { ProductDetailScreen } from './components/ProductDetailScreen.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { LoginScreen } from './components/SignIn.tsx';
import { RegisterScreen } from './components/Registers.tsx';
import { ProductsScreen } from './components/ProductsScreen.tsx';
import { CategoriesScreen } from './components/CategoriesScreen.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { CreateProductScreen } from './components/CreateProductScreen.tsx';
import { CartScreen } from './components/CartScreen.tsx';

const httpLink = new HttpLink({ uri: "http://localhost:8080/query" });

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

function isAuthenticated() {
  return !!localStorage.getItem('token');
}

function requireAuthLoader() {
  if (!isAuthenticated()) {
    throw redirect("/signin");
  }
  return null;
}

const router = createBrowserRouter([
  {
    path: "/products/:id",
    element: <ProductDetailScreen />,
    loader: requireAuthLoader,
    errorElement: <ErrorBoundary />
  },
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
    path: "/create-product",
    element: <CreateProductScreen />,
    loader: requireAuthLoader,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/products",
    element: <ProductsScreen />,
    loader: requireAuthLoader,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/categories",
    element: <CategoriesScreen />,
    loader: requireAuthLoader,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/cart",
    element: <CartScreen />,
    loader: requireAuthLoader,
    errorElement: <ErrorBoundary />
  },
  {
    path: "*",
    element: <App />,
    loader: requireAuthLoader,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </AuthProvider>
  </StrictMode>,
)
