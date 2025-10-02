import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
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

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:8080/graphql" }),
  cache: new InMemoryCache(),
});

function isAuthenticated() {
  return !localStorage.getItem('token');
}

function requireAuthLoader() {
  if (isAuthenticated()) {
    throw redirect("/signin");
  }
  return null;
}

const router = createBrowserRouter([
  {
    path: "/products/:id",
    element: <ProductDetailScreen />,
    loader: async ({ params }) => {
      requireAuthLoader();
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) {
        throw new Response("Product not found", { status: 404 });
      }
      return response.json();
    },
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
    path: "*",
    element: <App />,
    loader: requireAuthLoader,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </StrictMode>,
)
