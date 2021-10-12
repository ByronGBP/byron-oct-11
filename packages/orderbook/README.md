# Orderbook
- Component that shows real data sent by a public WebSocket `wss://www.cryptofacilities.com/ws/v1`
- Can toggle between BTC/ETH assets
- It closes the connection if the user leaves the page
- It throttles the data update based on the device performance
- [TODOS](TODOS.md)
- [KNOWN_BUGS](KNOWN_BUGS.md)

## Component Structure
```
orderbook/
  src/
  ├── components/
  │   ├── OrderBook
  │   └── TableData
  ├── hooks/
  │   ├── useOrderBook
  │   ├── useOrderBookState
  │   └── useSession
  └── lib
  └── index.tsx
```
- `components` has all the components UI
- `hooks` has all the hooks for data & connection management
- `lib` has external libraries
- [Architecture](https://docs.google.com/drawings/d/1sXYqlZ3zczdHMx6LAw6rGQ88QQ9i-xH-RHaOrtk686w/edit)

## Component external libraries
- `styled-components` to style components
- `framer-motion` to animate at maximum performance
- `lodash.throttle` to throttle functions
- `/lib/useMediaType` to know if browser is on mobile, tablet or desktop
- `jest` `jest-websocket-mock` `mock-socket` `babel-jest` `react-test-renderer` to testing purposes
- `@babel/*` `@types/*` `babel-jest` to compiling and building purposes
