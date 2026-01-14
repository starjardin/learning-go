# AGENTS.md

This file contains guidelines and commands for AI agents working on the Onja Products codebase.

## Project Overview

Onja Products is a full-stack e-commerce platform with:
- **Backend**: Go GraphQL API with PostgreSQL
- **Frontend**: React + TypeScript + Vite with Tailwind CSS
- **Database**: PostgreSQL with SQLC for type-safe queries

## Development Commands

### Backend (Go)
```bash
# Start PostgreSQL container
make postgres

# Create database
make createdb

# Database migrations
make migrateup          # Run all migrations
make migrateup1         # Run one migration
make migratedown        # Rollback all migrations
make migratedown1       # Rollback one migration
make new_migration name=<name>  # Create new migration

# Code generation
make sqlc               # Generate SQL code
make gqlgen             # Generate GraphQL code
make mock               # Generate mock files

# Development
make server             # Start development server
make test               # Run all tests with coverage

# Single test (Go)
go test -v -run <TestName> ./...
go test -v ./<package_name>  # Test specific package
```

### Frontend (React)
```bash
cd frontend

# Development
npm run dev             # Start development server
npm run build           # Production build
npm run preview         # Preview production build
npm run lint            # Run ESLint

# Single test (if jest is added)
npm test -- <TestName>
npm test -- --testPathPattern=<filename>
```

## Code Style Guidelines

### Go Backend

#### Imports
- Use standard Go import grouping with blank lines
- Third-party imports first, then project imports
- Use alias for project packages: `db "github.com/starjardin/onja-products/db/sqlc"`

#### Naming Conventions
- **Packages**: lowercase, short, descriptive (e.g., `utils`, `token`, `graph`)
- **Functions**: CamelCase for exported, camelCase for unexported
- **Variables**: camelCase, descriptive names
- **Constants**: UPPER_SNAKE_CASE for exported constants
- **Interfaces**: Usually end with `er` (e.g., `Maker`, `Store`)

#### Error Handling
- Always handle errors explicitly
- Use `if err != nil` pattern
- Return errors from functions, don't panic unless unrecoverable
- Use descriptive error messages with context

#### Structure
- Follow clean architecture principles
- Separate concerns: handlers, business logic, data access
- Use dependency injection (see `graph/resolver.go`)
- Keep main.go lean and focused on setup

#### GraphQL
- Use gqlgen for code generation
- Implement resolvers in `graph/resolvers.go`
- Keep resolver logic minimal, delegate to business logic
- Use generated types for consistency

### TypeScript Frontend

#### Imports
- Use absolute imports for React: `import React from 'react'`
- Group imports: external libraries first, then internal components
- Use type imports: `import type { ButtonProps } from './Button'`

#### Component Structure
- Use functional components with hooks
- Prefer explicit interfaces for props
- Use React.FC for components with typed props
- Export components as named exports or default exports consistently

#### TypeScript Configuration
- Strict mode enabled
- No unused locals/parameters
- React JSX transform
- ESNext modules with bundler resolution

#### Naming Conventions
- **Components**: PascalCase (e.g., `Button`, `Header`)
- **Files**: PascalCase for components (e.g., `Button.tsx`)
- **Variables/Functions**: camelCase
- **Interfaces/Types**: PascalCase, descriptive names
- **Constants**: UPPER_SNAKE_CASE

#### Styling
- Use Tailwind CSS classes
- Avoid inline styles except for dynamic values
- Use semantic HTML elements
- Follow mobile-first responsive design

## Database Guidelines

### SQLC
- Write queries in `db/queries/` directory
- Use snake_case for SQL column names
- Run `make sqlc` after modifying queries
- Use generated types for type safety

### Migrations
- Name migrations descriptively with sequential numbers
- Use UP/DOWN migration pattern
- Test migrations in both directions
- Keep migrations backward compatible when possible

## Testing Guidelines

### Go
- Write table-driven tests for complex logic
- Use testify for assertions (if available)
- Mock external dependencies using generated mocks
- Aim for high test coverage on business logic

### TypeScript
- Use React Testing Library for component tests
- Test user behavior, not implementation details
- Mock API calls in tests
- Write meaningful test descriptions

## Security Guidelines

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all inputs (both backend and frontend)
- Use parameterized queries (SQLC handles this)
- Implement proper authentication and authorization

## Git Workflow

- Use conventional commit messages
- Create feature branches for new functionality
- Run tests and linting before committing
- Ensure code generation is up-to-date before commits

## Code Generation

### Backend
- Always run `make sqlc` after database schema changes
- Always run `make gqlgen` after GraphQL schema changes
- Always run `make mock` after interface changes
- Commit generated files with the code that generates them

### Frontend
- No code generation currently configured
- If added, document commands here

## Performance Considerations

### Backend
- Use connection pooling (pgxpool)
- Implement proper database indexing
- Use GraphQL query complexity analysis
- Cache frequently accessed data

### Frontend
- Use React.memo for expensive components
- Implement code splitting for large applications
- Optimize bundle size with dynamic imports
- Use proper loading states

## Common Patterns

### Error Response Pattern (Go)
```go
data, err := someFunction()
if err != nil {
    return nil, fmt.Errorf("operation failed: %w", err)
}
return data, nil
```

### Component Pattern (TypeScript)
```typescript
interface ComponentProps {
    // Define props here
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
    // Component logic
    return <div>{/* JSX */}</div>
}

export default Component
```

## Development Environment Setup

1. Start PostgreSQL: `make postgres`
2. Create database: `make createdb`
3. Run migrations: `make migrateup`
4. Start backend: `make server`
5. Start frontend: `cd frontend && npm run dev`

## Notes for AI Agents

- This is a production codebase, maintain high quality standards
- Always run tests and linting before suggesting changes
- Follow existing patterns and conventions
- Ask for clarification if requirements are ambiguous
- Focus on type safety and error handling
- Keep changes small and focused