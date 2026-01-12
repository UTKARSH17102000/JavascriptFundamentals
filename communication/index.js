// Short Polling 

// -> UI calls the server multiple times in an interval to get the latest data.
// -> It is a simple and easy to implement.


// Long Polling

// -> UI calls the server and waits for the server to respond.
// -> If the server has no data, it will wait for the server to respond.
// -> server will hold the connection open until there is new data.
// -> server send the data at once and then close the connection.


// Server Sent Events (SSE)

// -> UI calls the server and waits for the server to respond.
// -> server can send the data multiple time with single HTTP connection.
// -> Long Live Unidirectional Communication.
// -> Example: Notifications, Feeds, Stock Price Updates, News Updates, monitoring dashboard etc.

// Challanges: Browser Support, No of Connections, Connection timeout, Background Tab behavior , Resource Intensive, Load Balancing, Sticky Connections, Proxy Firewall, Brodcasting.


// WebSockets

// -> Full Duplex Communication.
// -> Long Live Bidirectional Communication.
// -> Example: Chat, Live Updates, etc.

// WebRTC

// -> Full Duplex Communication.
// -> Long Live Bidirectional Communication.
// -> Example: Video Calling, Screen Sharing, etc.


// Webhooks

//-> Real Time Communication.
//-> Event Driven Communication.
//-> Post Rest API Call to the server. Get's trigger on event
//-> Authorization is done using a secret Key.
//=> Verification/Acknowledgment
//-> Example: Payment Notifications, Order Notifications, Data Synchronization,CI CD Automation etc.
