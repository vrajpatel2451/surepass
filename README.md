# Surepass TypeScript SDK

Minimal, framework-agnostic Surepass GST verification SDK for Node.js 18+.

## Install

```bash
npm install @vrajpatel2451/surepass-sdk
```

## Usage

```ts
import { Surepass } from '@vrajpatel2451/surepass-sdk';

const surepass = new Surepass({
  baseUrl: process.env.SUREPASS_BASE_URL!,
  token: process.env.SUREPASS_TOKEN!,
});

const gst = await surepass.verifyGstin('24AALCD9657Q1ZO');
// { legal_name, business_name, address, gstin, constitution_of_business }
```

API failures throw `SurepassError` with the HTTP `status` and parsed response `body`.

## Development

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

## Releases

Pushes and pull requests to `main` run linting, type checking, tests, and the package build. To publish, create a repository secret named `KEY_TO_DISPATCH`, then select **Actions → Publish to npm → Run workflow**, enter the matching `keyToDispatch`, and approve the protected `npm-production` environment. The npm package must trust `.github/workflows/publish.yml` as its GitHub Actions publisher.

## License

MIT
