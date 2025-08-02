# 📋 Chat & Cart Persistence Implementation Plan

## 🎯 Architecture Decision: Client-Side + Resumable Streams

### **Why This Combination?**
- **Vercel Resumable Stream** solves the streaming interruption problem
- **Client-side persistence** keeps conversation history simple
- **Best of both worlds**: Stream reliability + no auth complexity
- **AI SDK v5 compatible** with resumable stream patterns

### **Storage Strategy:**
- **IndexedDB**: Full conversation history, tool results, metadata
- **localStorage**: Cart ID, session metadata, stream tokens

---

## 📝 Implementation Plan

### **Phase 1: Foundation Setup**
- [ ] Install dependencies (`idb`, `resumable-stream`)
- [ ] Create conversation schema for IndexedDB
- [ ] Set up client-side ID generation (`nanoid`)
- [ ] Create persistence service layer
- [ ] **NEW**: Configure resumable stream infrastructure

### **Phase 2: Resumable Streaming Integration**
- [ ] **NEW**: Modify API route to use resumable streams
- [ ] **NEW**: Add stream token generation and storage
- [ ] **NEW**: Implement stream checkpoint handling
- [ ] **NEW**: Create stream recovery logic on frontend
- [ ] **NEW**: Add stream interruption detection

### **Phase 3: Chat Persistence with Stream Recovery**
- [ ] Modify `useChat` to use conversation IDs + stream tokens
- [ ] Implement conversation saving to IndexedDB on message updates
- [ ] **NEW**: Save partial messages during streaming
- [ ] **NEW**: Restore interrupted streams on app startup
- [ ] Add conversation loading and history view
- [ ] **NEW**: Handle stream failure gracefully with retry options

### **Phase 4: Cart Integration (Enhanced)**
- [ ] Add cart ID storage in localStorage
- [ ] Implement cart creation detection (first `update_cart`)
- [ ] Link cart ID to conversation session in IndexedDB
- [ ] Add cart validation on app load (`get_cart` MCP call)
- [ ] **NEW**: Handle cart operations during stream interruptions
- [ ] **NEW**: Validate cart state consistency after stream recovery

### **Phase 5: Stream Resilience & UX**
- [ ] **NEW**: Implement automatic stream resumption
- [ ] **NEW**: Add visual indicators for streaming/recovery states
- [ ] **NEW**: Create manual "resume stream" option
- [ ] Handle expired/invalid cart scenarios
- [ ] **NEW**: Stream timeout and cleanup handling
- [ ] **NEW**: Offline stream queuing

### **Phase 6: Enhanced UX**
- [ ] Add "Continue conversation" from history
- [ ] Implement conversation search and filtering
- [ ] Add conversation deletion and cleanup
- [ ] Create shareable conversation links
- [ ] **NEW**: Stream recovery notifications
- [ ] **NEW**: "Lost connection" retry mechanisms

---

## 🌊 Resumable Stream Integration

### **Stream State Management:**
```javascript
localStorage keys:
- activeStreamToken: string | null
- streamConversationId: string | null
- streamStartTime: timestamp
- lastStreamCheckpoint: string

IndexedDB additions:
- streamStates: {
    token: string
    conversationId: string
    messageId: string
    checkpoint: string
    status: 'active' | 'paused' | 'completed' | 'failed'
    createdAt: timestamp
  }
```

### **Recovery Flow:**
1. **On app load**: Check localStorage for `activeStreamToken`
2. **If found**: Attempt to resume stream with token
3. **Success**: Continue streaming from checkpoint
4. **Failure**: Mark stream as failed, offer retry
5. **Cleanup**: Remove completed/failed stream tokens

### **Stream Interruption Handling:**
```
User Flow:
1. User sends message → Generate stream token
2. Store token in localStorage + IndexedDB
3. Begin streaming with checkpoints
4. User leaves → Stream paused automatically
5. User returns → Detect stored token → Resume stream
6. Stream completes → Clean up tokens
```

---

## 🗂️ Data Structure Design

### **IndexedDB Schema:**
```javascript
conversations: {
  id: string (client-generated)
  title: string (auto-generated from first message)
  createdAt: timestamp
  updatedAt: timestamp
  cartId?: string (Shopify cart ID when created)
  messageCount: number
}

messages: {
  id: string (client-generated) 
  conversationId: string (foreign key)
  role: 'user' | 'assistant' | 'system'
  content: string | MessageParts[]
  metadata: object
  createdAt: timestamp
  streamingState?: 'pending' | 'streaming' | 'completed'
}

toolResults: {
  id: string
  messageId: string (foreign key)
  toolName: string
  result: object
  createdAt: timestamp
}

streamStates: {
  token: string
  conversationId: string
  messageId: string
  checkpoint: string
  status: 'active' | 'paused' | 'completed' | 'failed'
  createdAt: timestamp
}
```

### **localStorage Keys:**
```javascript
currentConversationId: string
activeCartId: string | null
activeStreamToken: string | null
streamConversationId: string | null
userPreferences: object
lastSyncTimestamp: timestamp
```

---

## 🔄 User Flow Examples

### **New User Experience:**
1. Open app → Generate conversation ID → Show opening screen
2. Send first message → Save to IndexedDB → Display chat interface
3. Ask about products → Tool results cached in IndexedDB
4. Add to cart → Create Shopify cart → Store cart ID in localStorage + IndexedDB

### **Returning User Experience:**
1. Open app → Check localStorage for `currentConversationId`
2. Load conversation from IndexedDB → Restore chat state
3. Validate cart ID (if exists) via `get_cart` MCP call
4. Continue conversation seamlessly

### **Stream Interruption & Recovery:**
1. User sends message → Start streaming → Generate stream token
2. Store token in localStorage + IndexedDB
3. User closes browser mid-stream → Stream paused
4. User returns → Detect stored token → Resume stream automatically
5. Stream completes → Clean up tokens

### **Cart Expiration Handling:**
1. User returns after cart expires → `get_cart` fails
2. Clear invalid cart ID from storage → Log warning
3. User adds new product → Create fresh cart → Update storage
4. Conversation context preserved, new cart linked

---

## 🔧 Technical Implementation Notes

### **API Route Changes:**
- Integrate `resumable-stream` with existing MCP wrapper
- Generate resumable tokens for each streaming request
- Store stream checkpoints during tool executions
- Handle resume requests with token validation

### **Frontend Changes:**
- Detect interrupted streams on component mount
- Show recovery UI when streams can be resumed
- Handle partial message reconstruction
- Graceful fallback when resume fails

### **Error Scenarios:**
- **Token expired**: Clean up, offer fresh retry
- **Stream corrupted**: Reset conversation state
- **Network failure**: Queue for retry when online
- **Server unavailable**: Client-only mode with warnings

---

## ⚡ Performance Considerations

### **Loading Strategy:**
- Load conversation metadata immediately
- Lazy load full message history (paginated)
- Cache recent tool results for faster display

### **Storage Limits:**
- Monitor IndexedDB usage
- Implement conversation cleanup (delete old conversations)
- Compress stored data where possible

### **Network Optimization:**
- Queue cart operations when offline
- Retry failed operations on reconnection
- Show appropriate loading/offline states

---

## ✅ Benefits of Updated Approach

### **Streaming Reliability:**
- **Zero message loss** during interruptions
- **Automatic recovery** when returning to app
- **Manual retry** options for failed streams
- **Graceful degradation** when resume fails

### **User Experience:**
- **Seamless continuation** of interrupted conversations
- **Clear feedback** about stream status
- **No re-asking** of questions after interruptions
- **Consistent cart state** even during stream failures

### **Technical Benefits:**
- **Vercel infrastructure** handles stream complexity
- **Client-side simplicity** maintained for storage
- **No authentication** required (token-based)
- **Scales automatically** with Vercel platform

---

## 🚀 Migration Path

### **Phase Implementation:**
1. **Start with basic client persistence** (Phases 1, 3, 4)
2. **Add resumable streams** when ready (Phase 2)
3. **Enhance with recovery UX** (Phases 5, 6)

### **Rollback Safety:**
- Resumable streams are additive
- Can disable and fall back to basic streaming
- Client persistence works independently

---

## 📋 Current Status

### **✅ Already Implemented:**
- Basic resumable stream infrastructure in API route (`app/api/chat/route.ts`)
- Stream context creation with Redis fallback
- `nanoid` for unique stream ID generation
- AI SDK v5 `createUIMessageStream` integration

### **🔄 In Progress:**
- Stream token management needs frontend integration
- Persistence layer needs IndexedDB setup
- Cart state management needs localStorage integration

### **⏳ Next Steps:**
1. Set up IndexedDB schema and service layer
2. Integrate stream token detection on frontend
3. Implement conversation persistence
4. Add cart state management

This plan provides enterprise-grade reliability while maintaining the simplicity of client-side persistence for completed conversations. The combination solves the critical streaming interruption problem with minimal backend complexity.