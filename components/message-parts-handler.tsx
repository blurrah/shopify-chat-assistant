'use client';

import type { UIMessagePart } from 'ai';
import { ProductCatalogResult } from './shopify-tools/product-catalog-result';
import { PolicyFAQResult } from './shopify-tools/policy-faq-result';
import { CartResult } from './shopify-tools/cart-result';
import { CartUpdateResult } from './shopify-tools/cart-update-result';
import {
  AITool,
  AIToolHeader,
  AIToolContent,
  AIToolParameters,
  AIToolResult,
} from '@/components/ui/kibo-ui/ai/tool';

interface MessagePartsHandlerProps {
  parts: UIMessagePart<any, any>[];
}

export function MessagePartsHandler({ parts }: MessagePartsHandlerProps) {
  return (
    <>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index}>{part.text}</span>;
        }

        // Handle tool calls - the type includes the tool name
        if (part.type.startsWith('tool-')) {
          const toolName = part.type.replace('tool-', '');
          
          // Check if this is a streaming tool call or completed
          if ('state' in part) {
            const status = part.state === 'done' ? 'completed' : 
                          part.state === 'output-error' ? 'error' : 'running';
            
            return (
              <AITool key={index} defaultOpen>
                <AIToolHeader
                  status={status}
                  name={toolName}
                  description={getToolDescription(toolName)}
                />
                <AIToolContent>
                  {'input' in part && part.input && (
                    <AIToolParameters parameters={part.input} />
                  )}
                  {'output' in part && part.output && (
                    renderShopifyToolResult(toolName, part.output, false)
                  )}
                  {'errorText' in part && part.errorText && (
                    <AIToolResult error={part.errorText} />
                  )}
                </AIToolContent>
              </AITool>
            );
          }
        }

        return null;
      })}
    </>
  );
}

function getToolDescription(toolName: string): string {
  const descriptions: Record<string, string> = {
    search_shop_catalog: 'Searching product catalog',
    search_shop_policies_and_faqs: 'Looking up store policies and FAQs',
    get_cart: 'Retrieving cart contents',
    update_cart: 'Updating cart items',
  };
  
  return descriptions[toolName] || 'Running tool';
}

function renderShopifyToolResult(
  toolName: string,
  result: unknown,
  isError?: boolean
): React.ReactNode {
  if (isError) {
    return <AIToolResult error={String(result)} />;
  }

  switch (toolName) {
    case 'search_shop_catalog':
      return <ProductCatalogResult data={result} />;
    case 'search_shop_policies_and_faqs':
      return <PolicyFAQResult data={result} />;
    case 'get_cart':
      return <CartResult data={result} />;
    case 'update_cart':
      return <CartUpdateResult data={result} />;
    default:
      return <AIToolResult result={<pre>{JSON.stringify(result, null, 2)}</pre>} />;
  }
}