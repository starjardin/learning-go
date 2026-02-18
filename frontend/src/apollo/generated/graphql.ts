import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  refreshToken: Scalars['String']['output'];
  token: Scalars['String']['output'];
  user: User;
};

export type Cart = {
  __typename?: 'Cart';
  items: Array<CartItem>;
  total_items: Scalars['Int']['output'];
  total_price: Scalars['Int']['output'];
};

export type CartItem = {
  __typename?: 'CartItem';
  id: Scalars['ID']['output'];
  product: Product;
  product_id: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
  user_id: Scalars['Int']['output'];
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Company = {
  __typename?: 'Company';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CreateProductInput = {
  available_stocks: Scalars['Int']['input'];
  category: Scalars['String']['input'];
  company_id?: InputMaybe<Scalars['Int']['input']>;
  description: Scalars['String']['input'];
  image_link: Scalars['String']['input'];
  is_negotiable: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  owner_id: Scalars['Int']['input'];
  price: Scalars['Int']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addToCart: CartItem;
  clearCart: Scalars['Boolean']['output'];
  createCompany: Company;
  createProduct: Product;
  createUser: SignupResponse;
  deleteCompany: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  login: AuthResponse;
  refreshToken: AuthResponse;
  removeFromCart: Scalars['Boolean']['output'];
  updateCartItemQuantity: CartItem;
  updateCompany: Company;
  updateProduct: Product;
  updateUser: User;
  verifyEmail: AuthResponse;
};


export type MutationAddToCartArgs = {
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};


export type MutationCreateCompanyArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreateUserArgs = {
  input: UserInput;
};


export type MutationDeleteCompanyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationRemoveFromCartArgs = {
  productId: Scalars['ID']['input'];
};


export type MutationUpdateCartItemQuantityArgs = {
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};


export type MutationUpdateCompanyArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateProductArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProductInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type Product = {
  __typename?: 'Product';
  available_stocks: Scalars['Int']['output'];
  category: Scalars['String']['output'];
  company_id?: Maybe<Scalars['Int']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image_link: Scalars['String']['output'];
  is_negotiable: Scalars['Boolean']['output'];
  likes: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  owner_id: Scalars['Int']['output'];
  price: Scalars['Int']['output'];
  sold: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Category>;
  getCart: Cart;
  getCartItemCount: Scalars['Int']['output'];
  getCompanies: Array<Company>;
  getCompany?: Maybe<Company>;
  getProduct?: Maybe<Product>;
  getProductCount: Scalars['Int']['output'];
  getProducts: Array<Product>;
  getProductsAdvanced: Array<Product>;
  getProductsByOwner: Array<Product>;
  getUser?: Maybe<User>;
  listUsers: Array<User>;
};


export type QueryGetCompanyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetProductCountArgs = {
  companyId?: InputMaybe<Scalars['Int']['input']>;
  maxPrice?: InputMaybe<Scalars['Int']['input']>;
  minPrice?: InputMaybe<Scalars['Int']['input']>;
  minStock?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sold?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryGetProductsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  isNegotiable?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sold?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryGetProductsAdvancedArgs = {
  companyId?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  maxPrice?: InputMaybe<Scalars['Int']['input']>;
  minPrice?: InputMaybe<Scalars['Int']['input']>;
  minStock?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sold?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetProductsByOwnerArgs = {
  ownerId: Scalars['ID']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};

export type SignupResponse = {
  __typename?: 'SignupResponse';
  message: Scalars['String']['output'];
  user: User;
};

export type UpdateProductInput = {
  available_stocks?: InputMaybe<Scalars['Int']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  image_link?: InputMaybe<Scalars['String']['input']>;
  is_negotiable?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  sold?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateUserInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  company_id?: InputMaybe<Scalars['Int']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  full_name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  payment_method?: InputMaybe<Scalars['String']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  address: Scalars['String']['output'];
  company_id?: Maybe<Scalars['Int']['output']>;
  email: Scalars['String']['output'];
  full_name: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  payment_method: Scalars['String']['output'];
  phone_number: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UserInput = {
  address: Scalars['String']['input'];
  company_id?: InputMaybe<Scalars['Int']['input']>;
  email: Scalars['String']['input'];
  full_name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  payment_method: Scalars['String']['input'];
  phone_number: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'Product', id: string, name: string, description: string, price: number, image_link: string, available_stocks: number, is_negotiable: boolean, owner_id: number, company_id?: number | null, likes: number, sold: boolean, category: string } };

export type AddToCartMutationVariables = Exact<{
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
}>;


export type AddToCartMutation = { __typename?: 'Mutation', addToCart: { __typename?: 'CartItem', id: string, user_id: number, product_id: number, quantity: number, product: { __typename?: 'Product', id: string, name: string, price: number, image_link: string } } };

export type UpdateCartItemQuantityMutationVariables = Exact<{
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
}>;


export type UpdateCartItemQuantityMutation = { __typename?: 'Mutation', updateCartItemQuantity: { __typename?: 'CartItem', id: string, user_id: number, product_id: number, quantity: number } };

export type RemoveFromCartMutationVariables = Exact<{
  productId: Scalars['ID']['input'];
}>;


export type RemoveFromCartMutation = { __typename?: 'Mutation', removeFromCart: boolean };

export type ClearCartMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearCartMutation = { __typename?: 'Mutation', clearCart: boolean };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthResponse', token: string, refreshToken: string, user: { __typename?: 'User', id: string, username: string, email: string, full_name: string, address: string, phone_number: string, payment_method: string } } };

export type RegisterMutationVariables = Exact<{
  input: UserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', createUser: { __typename?: 'SignupResponse', message: string, user: { __typename?: 'User', id: string, username: string, email: string, full_name: string, address: string, phone_number: string, payment_method: string } } };

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'AuthResponse', token: string, refreshToken: string, user: { __typename?: 'User', id: string, username: string, email: string, full_name: string, address: string, phone_number: string, payment_method: string } } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type GetProductsQueryVariables = Exact<{
  category?: InputMaybe<Scalars['String']['input']>;
  sold?: InputMaybe<Scalars['Boolean']['input']>;
  isNegotiable?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetProductsQuery = { __typename?: 'Query', getProducts: Array<{ __typename?: 'Product', id: string, sold: boolean, description: string, price: number, image_link: string, name: string, is_negotiable: boolean, owner_id: number, company_id?: number | null, likes: number, available_stocks: number, category: string }> };

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, name: string, value: string }> };

export type GetProductQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProductQuery = { __typename?: 'Query', getProduct?: { __typename?: 'Product', id: string, name: string, description: string, price: number, image_link: string, available_stocks: number, is_negotiable: boolean, owner_id: number, company_id?: number | null, category: string, sold: boolean, likes: number } | null };

export type GetCartQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCartQuery = { __typename?: 'Query', getCart: { __typename?: 'Cart', total_items: number, total_price: number, items: Array<{ __typename?: 'CartItem', id: string, user_id: number, product_id: number, quantity: number, product: { __typename?: 'Product', id: string, name: string, price: number, image_link: string, available_stocks: number } }> } };

export type GetCartItemCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCartItemCountQuery = { __typename?: 'Query', getCartItemCount: number };


export const CreateProductDocument = gql`
    mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    id
    name
    description
    price
    image_link
    available_stocks
    is_negotiable
    owner_id
    company_id
    likes
    sold
    category
  }
}
    `;
export type CreateProductMutationFn = Apollo.MutationFunction<CreateProductMutation, CreateProductMutationVariables>;

/**
 * __useCreateProductMutation__
 *
 * To run a mutation, you first call `useCreateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductMutation, { data, loading, error }] = useCreateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProductMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, options);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const AddToCartDocument = gql`
    mutation AddToCart($productId: ID!, $quantity: Int!) {
  addToCart(productId: $productId, quantity: $quantity) {
    id
    user_id
    product_id
    quantity
    product {
      id
      name
      price
      image_link
    }
  }
}
    `;
export type AddToCartMutationFn = Apollo.MutationFunction<AddToCartMutation, AddToCartMutationVariables>;

/**
 * __useAddToCartMutation__
 *
 * To run a mutation, you first call `useAddToCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddToCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addToCartMutation, { data, loading, error }] = useAddToCartMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *      quantity: // value for 'quantity'
 *   },
 * });
 */
export function useAddToCartMutation(baseOptions?: Apollo.MutationHookOptions<AddToCartMutation, AddToCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddToCartMutation, AddToCartMutationVariables>(AddToCartDocument, options);
      }
export type AddToCartMutationHookResult = ReturnType<typeof useAddToCartMutation>;
export type AddToCartMutationResult = Apollo.MutationResult<AddToCartMutation>;
export type AddToCartMutationOptions = Apollo.BaseMutationOptions<AddToCartMutation, AddToCartMutationVariables>;
export const UpdateCartItemQuantityDocument = gql`
    mutation UpdateCartItemQuantity($productId: ID!, $quantity: Int!) {
  updateCartItemQuantity(productId: $productId, quantity: $quantity) {
    id
    user_id
    product_id
    quantity
  }
}
    `;
export type UpdateCartItemQuantityMutationFn = Apollo.MutationFunction<UpdateCartItemQuantityMutation, UpdateCartItemQuantityMutationVariables>;

/**
 * __useUpdateCartItemQuantityMutation__
 *
 * To run a mutation, you first call `useUpdateCartItemQuantityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCartItemQuantityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCartItemQuantityMutation, { data, loading, error }] = useUpdateCartItemQuantityMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *      quantity: // value for 'quantity'
 *   },
 * });
 */
export function useUpdateCartItemQuantityMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCartItemQuantityMutation, UpdateCartItemQuantityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCartItemQuantityMutation, UpdateCartItemQuantityMutationVariables>(UpdateCartItemQuantityDocument, options);
      }
export type UpdateCartItemQuantityMutationHookResult = ReturnType<typeof useUpdateCartItemQuantityMutation>;
export type UpdateCartItemQuantityMutationResult = Apollo.MutationResult<UpdateCartItemQuantityMutation>;
export type UpdateCartItemQuantityMutationOptions = Apollo.BaseMutationOptions<UpdateCartItemQuantityMutation, UpdateCartItemQuantityMutationVariables>;
export const RemoveFromCartDocument = gql`
    mutation RemoveFromCart($productId: ID!) {
  removeFromCart(productId: $productId)
}
    `;
export type RemoveFromCartMutationFn = Apollo.MutationFunction<RemoveFromCartMutation, RemoveFromCartMutationVariables>;

/**
 * __useRemoveFromCartMutation__
 *
 * To run a mutation, you first call `useRemoveFromCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFromCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFromCartMutation, { data, loading, error }] = useRemoveFromCartMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useRemoveFromCartMutation(baseOptions?: Apollo.MutationHookOptions<RemoveFromCartMutation, RemoveFromCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveFromCartMutation, RemoveFromCartMutationVariables>(RemoveFromCartDocument, options);
      }
export type RemoveFromCartMutationHookResult = ReturnType<typeof useRemoveFromCartMutation>;
export type RemoveFromCartMutationResult = Apollo.MutationResult<RemoveFromCartMutation>;
export type RemoveFromCartMutationOptions = Apollo.BaseMutationOptions<RemoveFromCartMutation, RemoveFromCartMutationVariables>;
export const ClearCartDocument = gql`
    mutation ClearCart {
  clearCart
}
    `;
export type ClearCartMutationFn = Apollo.MutationFunction<ClearCartMutation, ClearCartMutationVariables>;

/**
 * __useClearCartMutation__
 *
 * To run a mutation, you first call `useClearCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClearCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [clearCartMutation, { data, loading, error }] = useClearCartMutation({
 *   variables: {
 *   },
 * });
 */
export function useClearCartMutation(baseOptions?: Apollo.MutationHookOptions<ClearCartMutation, ClearCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClearCartMutation, ClearCartMutationVariables>(ClearCartDocument, options);
      }
export type ClearCartMutationHookResult = ReturnType<typeof useClearCartMutation>;
export type ClearCartMutationResult = Apollo.MutationResult<ClearCartMutation>;
export type ClearCartMutationOptions = Apollo.BaseMutationOptions<ClearCartMutation, ClearCartMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      id
      username
      email
      full_name
      address
      phone_number
      payment_method
    }
    token
    refreshToken
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($input: UserInput!) {
  createUser(input: $input) {
    user {
      id
      username
      email
      full_name
      address
      phone_number
      payment_method
    }
    message
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const VerifyEmailDocument = gql`
    mutation VerifyEmail($token: String!) {
  verifyEmail(token: $token) {
    user {
      id
      username
      email
      full_name
      address
      phone_number
      payment_method
    }
    token
    refreshToken
  }
}
    `;
export type VerifyEmailMutationFn = Apollo.MutationFunction<VerifyEmailMutation, VerifyEmailMutationVariables>;

/**
 * __useVerifyEmailMutation__
 *
 * To run a mutation, you first call `useVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailMutation, { data, loading, error }] = useVerifyEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useVerifyEmailMutation(baseOptions?: Apollo.MutationHookOptions<VerifyEmailMutation, VerifyEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument, options);
      }
export type VerifyEmailMutationHookResult = ReturnType<typeof useVerifyEmailMutation>;
export type VerifyEmailMutationResult = Apollo.MutationResult<VerifyEmailMutation>;
export type VerifyEmailMutationOptions = Apollo.BaseMutationOptions<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($token: String!, $newPassword: String!) {
  resetPassword(token: $token, newPassword: $newPassword)
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const GetProductsDocument = gql`
    query getProducts($category: String, $sold: Boolean, $isNegotiable: Boolean, $search: String) {
  getProducts(
    category: $category
    sold: $sold
    isNegotiable: $isNegotiable
    search: $search
  ) {
    id
    sold
    description
    price
    image_link
    name
    is_negotiable
    owner_id
    company_id
    likes
    sold
    available_stocks
    category
  }
}
    `;

/**
 * __useGetProductsQuery__
 *
 * To run a query within a React component, call `useGetProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsQuery({
 *   variables: {
 *      category: // value for 'category'
 *      sold: // value for 'sold'
 *      isNegotiable: // value for 'isNegotiable'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useGetProductsQuery(baseOptions?: Apollo.QueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
      }
export function useGetProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
        }
// @ts-ignore
export function useGetProductsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>): Apollo.UseSuspenseQueryResult<GetProductsQuery, GetProductsQueryVariables>;
export function useGetProductsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>): Apollo.UseSuspenseQueryResult<GetProductsQuery | undefined, GetProductsQueryVariables>;
export function useGetProductsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
        }
export type GetProductsQueryHookResult = ReturnType<typeof useGetProductsQuery>;
export type GetProductsLazyQueryHookResult = ReturnType<typeof useGetProductsLazyQuery>;
export type GetProductsSuspenseQueryHookResult = ReturnType<typeof useGetProductsSuspenseQuery>;
export type GetProductsQueryResult = Apollo.QueryResult<GetProductsQuery, GetProductsQueryVariables>;
export const GetCategoriesDocument = gql`
    query getCategories {
  categories {
    id
    name
    value
  }
}
    `;

/**
 * __useGetCategoriesQuery__
 *
 * To run a query within a React component, call `useGetCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
      }
export function useGetCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
        }
// @ts-ignore
export function useGetCategoriesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>): Apollo.UseSuspenseQueryResult<GetCategoriesQuery, GetCategoriesQueryVariables>;
export function useGetCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>): Apollo.UseSuspenseQueryResult<GetCategoriesQuery | undefined, GetCategoriesQueryVariables>;
export function useGetCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
        }
export type GetCategoriesQueryHookResult = ReturnType<typeof useGetCategoriesQuery>;
export type GetCategoriesLazyQueryHookResult = ReturnType<typeof useGetCategoriesLazyQuery>;
export type GetCategoriesSuspenseQueryHookResult = ReturnType<typeof useGetCategoriesSuspenseQuery>;
export type GetCategoriesQueryResult = Apollo.QueryResult<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const GetProductDocument = gql`
    query GetProduct($id: ID!) {
  getProduct(id: $id) {
    id
    name
    description
    price
    image_link
    available_stocks
    is_negotiable
    owner_id
    company_id
    category
    sold
    likes
  }
}
    `;

/**
 * __useGetProductQuery__
 *
 * To run a query within a React component, call `useGetProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProductQuery(baseOptions: Apollo.QueryHookOptions<GetProductQuery, GetProductQueryVariables> & ({ variables: GetProductQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
      }
export function useGetProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
        }
// @ts-ignore
export function useGetProductSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProductQuery, GetProductQueryVariables>): Apollo.UseSuspenseQueryResult<GetProductQuery, GetProductQueryVariables>;
export function useGetProductSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductQuery, GetProductQueryVariables>): Apollo.UseSuspenseQueryResult<GetProductQuery | undefined, GetProductQueryVariables>;
export function useGetProductSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
        }
export type GetProductQueryHookResult = ReturnType<typeof useGetProductQuery>;
export type GetProductLazyQueryHookResult = ReturnType<typeof useGetProductLazyQuery>;
export type GetProductSuspenseQueryHookResult = ReturnType<typeof useGetProductSuspenseQuery>;
export type GetProductQueryResult = Apollo.QueryResult<GetProductQuery, GetProductQueryVariables>;
export const GetCartDocument = gql`
    query GetCart {
  getCart {
    items {
      id
      user_id
      product_id
      quantity
      product {
        id
        name
        price
        image_link
        available_stocks
      }
    }
    total_items
    total_price
  }
}
    `;

/**
 * __useGetCartQuery__
 *
 * To run a query within a React component, call `useGetCartQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCartQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCartQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCartQuery(baseOptions?: Apollo.QueryHookOptions<GetCartQuery, GetCartQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCartQuery, GetCartQueryVariables>(GetCartDocument, options);
      }
export function useGetCartLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCartQuery, GetCartQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCartQuery, GetCartQueryVariables>(GetCartDocument, options);
        }
// @ts-ignore
export function useGetCartSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCartQuery, GetCartQueryVariables>): Apollo.UseSuspenseQueryResult<GetCartQuery, GetCartQueryVariables>;
export function useGetCartSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCartQuery, GetCartQueryVariables>): Apollo.UseSuspenseQueryResult<GetCartQuery | undefined, GetCartQueryVariables>;
export function useGetCartSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCartQuery, GetCartQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCartQuery, GetCartQueryVariables>(GetCartDocument, options);
        }
export type GetCartQueryHookResult = ReturnType<typeof useGetCartQuery>;
export type GetCartLazyQueryHookResult = ReturnType<typeof useGetCartLazyQuery>;
export type GetCartSuspenseQueryHookResult = ReturnType<typeof useGetCartSuspenseQuery>;
export type GetCartQueryResult = Apollo.QueryResult<GetCartQuery, GetCartQueryVariables>;
export const GetCartItemCountDocument = gql`
    query GetCartItemCount {
  getCartItemCount
}
    `;

/**
 * __useGetCartItemCountQuery__
 *
 * To run a query within a React component, call `useGetCartItemCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCartItemCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCartItemCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCartItemCountQuery(baseOptions?: Apollo.QueryHookOptions<GetCartItemCountQuery, GetCartItemCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCartItemCountQuery, GetCartItemCountQueryVariables>(GetCartItemCountDocument, options);
      }
export function useGetCartItemCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCartItemCountQuery, GetCartItemCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCartItemCountQuery, GetCartItemCountQueryVariables>(GetCartItemCountDocument, options);
        }
// @ts-ignore
export function useGetCartItemCountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCartItemCountQuery, GetCartItemCountQueryVariables>): Apollo.UseSuspenseQueryResult<GetCartItemCountQuery, GetCartItemCountQueryVariables>;
export function useGetCartItemCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCartItemCountQuery, GetCartItemCountQueryVariables>): Apollo.UseSuspenseQueryResult<GetCartItemCountQuery | undefined, GetCartItemCountQueryVariables>;
export function useGetCartItemCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCartItemCountQuery, GetCartItemCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCartItemCountQuery, GetCartItemCountQueryVariables>(GetCartItemCountDocument, options);
        }
export type GetCartItemCountQueryHookResult = ReturnType<typeof useGetCartItemCountQuery>;
export type GetCartItemCountLazyQueryHookResult = ReturnType<typeof useGetCartItemCountLazyQuery>;
export type GetCartItemCountSuspenseQueryHookResult = ReturnType<typeof useGetCartItemCountSuspenseQuery>;
export type GetCartItemCountQueryResult = Apollo.QueryResult<GetCartItemCountQuery, GetCartItemCountQueryVariables>;