# OrderBook UI workspace
- https://byron-oct-11.vercel.app/

 ## Project structure
```
pacakages/
├── client
└── orderbook
```
- Yarn workspace
- `orderbook` [react component](packages/orderbook/README.md) written in typescript
- `client` [nextjs](packages/client/README.md) project where the orderbook component is used

## Scripts
- run locally the client
- `yarn dev` previously builds the orderbook component
 ```
 yarn
 yarn dev
 ```

- run locally both orderbook & client
- `yarn dev:orderbook` starts tsc and watch
 ```
 yarn
 yarn dev:orderbook
 yarn dev
 ```
- run tests for the orderbook component
 ```
 yarn
 yarn tests:orderbook
 ```

