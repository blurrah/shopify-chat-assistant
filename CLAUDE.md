# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Goal

This project provides a shopping chat assistant template using the Shopify MCP server. The application is currently in development and serves as a foundation for building AI-powered shopping experiences that integrate with Shopify's Model Context Protocol.

## Development Commands

- `pnpm dev` - Start development server with Turbopack (Next.js 15.4.4)
- `pnpm build` - Build production version
- `pnpm start` - Start production server
- `pnpm lint` - Run Next.js linting

## Architecture Overview

This is a Shopify Chat Assistant built with Next.js 15 and the AI SDK. The application integrates with Shopify's Model Context Protocol (MCP) to provide shopping assistance.

### Key Components

**AI Integration (`lib/ai.ts`, `app/api/chat/route.ts`)**
- Uses AI SDK v5.0.0-beta with OpenAI GPT-4o via AI Gateway
- Integrates with Shopify MCP client via StreamableHTTPClientTransport
- System prompt configures assistant as shopping helper
- Tool calls limited to 10 steps with auto tool choice

**MCP Client Setup (`app/api/chat/route.ts:10-14`)**
- Connects to `https://${MYSHOPIFY_DOMAIN}/api/mcp` endpoint
- Requires `MYSHOPIFY_DOMAIN` environment variable
- Uses sessionId "CHANGETHIS" (needs configuration)
- Automatically closes client after stream completion

**Chat Interface (`components/chat.tsx`)**
- Built with custom Kibo UI components for AI conversations
- Uses `useChat` hook from AI SDK React
- Renders message parts (currently only text parts)
- Includes scroll-to-bottom functionality

**Type System (`lib/types.ts`)**
- Defines `ChatTools` with `productsCatalog` tool
- Product schema includes id, title, price, image, url
- Message metadata includes createdAt timestamp
- Uses Zod for runtime validation

### UI Framework

- Built with Next.js App Router
- Uses Radix UI primitives with custom Kibo UI components
- Tailwind CSS v4 for styling
- Lucide React for icons
- React Markdown with KaTeX support for mathematical expressions

### Environment Setup

Required environment variables:
- `MYSHOPIFY_DOMAIN` - Your Shopify domain for MCP connection

### Key Files Structure

- `app/api/chat/route.ts` - Chat API endpoint with MCP integration
- `lib/ai.ts` - AI model and system prompt configuration
- `components/chat.tsx` - Main chat interface component
- `components/ui/kibo-ui/ai/` - Custom AI conversation components
- `lib/types.ts` - TypeScript definitions for chat tools and messages