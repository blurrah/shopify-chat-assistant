'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircleIcon, ShoppingCartIcon, PlusIcon, MinusIcon, XIcon } from 'lucide-react';

interface UpdatedItem {
  id: string;
  title: string;
  quantity: number;
  action?: 'added' | 'updated' | 'removed';
  previousQuantity?: number;
}

interface CartUpdateData {
  success?: boolean;
  message?: string;
  cartId?: string;
  updatedItems?: UpdatedItem[];
  totalItems?: number;
  checkoutUrl?: string;
}

interface CartUpdateResultProps {
  data: unknown;
  className?: string;
}

export function CartUpdateResult({ data, className }: CartUpdateResultProps) {
  const updateData = data as CartUpdateData;
  const updatedItems = updateData?.updatedItems || [];
  
  if (!updateData?.success) {
    return (
      <div className={cn('text-destructive text-sm', className)}>
        Cart update failed: {updateData?.message || 'Unknown error'}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <CheckCircleIcon className="size-4 text-green-600" />
        <h4 className="font-medium text-sm">Cart Updated Successfully</h4>
        {updateData.totalItems && (
          <Badge variant="secondary">{updateData.totalItems} total items</Badge>
        )}
      </div>

      {updateData.message && (
        <p className="text-sm text-muted-foreground">{updateData.message}</p>
      )}

      {updatedItems.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Changes Made
          </h5>
          
          <div className="grid gap-2">
            {updatedItems.map((item) => {
              const ActionIcon = getActionIcon(item.action);
              const actionColor = getActionColor(item.action);
              
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border p-2 bg-muted/20"
                >
                  <ActionIcon className={cn('size-4', actionColor)} />
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {item.action === 'added' && (
                        <span>Added {item.quantity} items</span>
                      )}
                      {item.action === 'updated' && (
                        <span>
                          Updated quantity: {item.previousQuantity} → {item.quantity}
                        </span>
                      )}
                      {item.action === 'removed' && (
                        <span>Removed from cart</span>
                      )}
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={cn('text-xs', actionColor)}
                  >
                    {item.action || 'updated'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {updateData.checkoutUrl && (
        <div className="pt-2 border-t">
          <a
            href={updateData.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md px-3 py-2 text-sm transition-colors"
          >
            <ShoppingCartIcon className="size-4" />
            View Updated Cart
          </a>
        </div>
      )}
    </div>
  );
}

function getActionIcon(action?: string) {
  switch (action) {
    case 'added':
      return PlusIcon;
    case 'removed':
      return XIcon;
    case 'updated':
    default:
      return MinusIcon;
  }
}

function getActionColor(action?: string) {
  switch (action) {
    case 'added':
      return 'text-green-600';
    case 'removed':
      return 'text-red-600';
    case 'updated':
    default:
      return 'text-blue-600';
  }
}