# Portainer CLI

A command-line interface for managing Portainer and Kubernetes deployments through Portainer API.

## Usage

### Environment Variables

Set the following environment variables before using the CLI:

```bash
export PORTAINER_URL="http://localhost:9000"
export PORTAINER_USERNAME="your-username"
export PORTAINER_PASSWORD="your-password"
```

### Commands

#### Update Deployment Image

Update a Kubernetes deployment image through Portainer:

```bash
portainer update-image <deployment-name> <image-name>
```

**Options:**
- `-n, --namespace <namespace>` - Kubernetes namespace (default: default)
- `-e, --endpoint <endpoint-id>` - Portainer endpoint ID (default: 1)

**Example:**
```bash
portainer -n production -e 2 update-image my-app nginx:1.21
```

### Global Options
- `-h, --help` - Show help information

## Development

### Prerequisites

- Node.js 20+
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Run CLI in development mode
pnpm cli <command> [args...]
```

### Project Structure

```
src/
├── cli.ts              # CLI entry point
├── env.ts              # Environment variables handling
├── index.ts            # Main library export
├── types.ts            # TypeScript type definitions
├── commands/           # CLI commands
│   ├── index.ts
│   └── update-image.ts
└── lib/                # Core library code
    ├── client.ts       # Portainer API client
    └── kubernetes-client.ts  # Kubernetes operations
```

## API

The package also exports a programmatic API for use in other Node.js applications:

```typescript
import { PortainerClient } from 'portainer';

const client = new PortainerClient({
  url: 'http://localhost:9000',
  username: 'admin',
  password: 'password'
});

// Use the client programmatically
```

## License

MIT