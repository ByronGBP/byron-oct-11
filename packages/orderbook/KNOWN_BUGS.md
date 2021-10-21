# KNOWN BUGS
- `isLoading` defers with throttled `getParsedData` function [useOrderBookState.ts](src/hooks/useOrderBookState/useOrderBookState.ts#38)
  - isLoading change as soon as the first "message" action is dispatched but the `getParsedData` is still throttled so it doesn't show the correct data on the UI
- `tr` element doesn't apply `position: relative` [TableData.tsx](src/components/TableData/TableData.tsx#L40)
- when it sends a message to the WebSocket, it sends a duplicated [useOrderBook.ts](src/hooks/useOrderBook/useOrderBook.ts)
- when it closes the connection with the WebSocket, the last throttled function still running [useOrderBook.ts](src/hooks/useOrderBook/useOrderBook.ts)
- Some tests don't count callback functions even though it ran [useSession.tests.ts](src/hooks/useSession/useSession.test.ts#L67)
- Some tests updates the hook's state when onclose event triggers [useOrderBookData.tests.ts](src/hooks/useOrderBook/useOrderBookData.test.ts)
