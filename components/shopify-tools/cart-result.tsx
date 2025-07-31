'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ShoppingCartIcon, ExternalLinkIcon } from 'lucide-react';

interface CartItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  currency?: string;
  variantId?: string;
  imageUrl?: string;
}

interface CartData {
  id?: string;
  items?: CartItem[];
  totalQuantity?: number;
  totalPrice?: number;
  currency?: string;
  checkoutUrl?: string;
}

interface CartResultProps {
  data: unknown;
  className?: string;
}

export function CartResult({ data, className }: CartResultProps) {
  const cartData = data as CartData;
  const items = cartData?.items || [];
  const isEmpty = items.length === 0;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCartIcon className="size-4 text-muted-foreground" />
          <h4 className="font-medium text-sm">Shopping Cart</h4>
        </div>
        {!isEmpty && (
          <Badge variant="secondary">
            {cartData.totalQuantity || items.length} items
          </Badge>
        )}
      </div>

      {isEmpty ? (
        <div className="text-center py-6 text-muted-foreground">
          <ShoppingCartIcon className="size-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Your cart is empty</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 rounded-lg border p-3 bg-muted/20"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="size-12 rounded-md object-cover flex-shrink-0"
                  />
                )}
                
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm truncate">{item.title}</h5>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Qty: {item.quantity}</span>
                      {item.variantId && (
                        <span>• Variant: {item.variantId}</span>
                      )}
                    </div>
                    
                    <span className="font-semibold text-sm">
                      {item.currency || '$'}{item.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {cartData.totalPrice && (
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="font-medium text-sm">Total</span>
              <span className="font-bold text-lg">
                {cartData.currency || '$'}{cartData.totalPrice}
              </span>
            </div>
          )}

          {cartData.checkoutUrl && (
            <a
              href={cartData.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Proceed to Checkout
              <ExternalLinkIcon className="size-4" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}