'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  title: string;
  price: number;
  currency?: string;
  variantId?: string;
  url?: string;
  imageUrl?: string;
  description?: string;
}

interface ProductCatalogData {
  products?: Product[];
}

interface ProductCatalogResultProps {
  data: unknown;
  className?: string;
}

export function ProductCatalogResult({ data, className }: ProductCatalogResultProps) {
  const catalogData = data as ProductCatalogData;
  const products = catalogData?.products || [];

  if (products.length === 0) {
    return (
      <div className={cn('text-muted-foreground text-sm', className)}>
        No products found
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Products Found</h4>
        <Badge variant="secondary">{products.length} results</Badge>
      </div>
      
      <div className="grid gap-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="size-16 rounded-md object-cover flex-shrink-0"
              />
            )}
            
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-sm truncate">{product.title}</h5>
              
              <div className="flex items-center gap-2 mt-1">
                <span className="font-semibold text-sm">
                  {product.currency || '$'}{product.price}
                </span>
                {product.variantId && (
                  <Badge variant="outline" className="text-xs">
                    Variant: {product.variantId}
                  </Badge>
                )}
              </div>
              
              {product.description && (
                <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                  {product.description}
                </p>
              )}
              
              {product.url && (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs mt-1 inline-block"
                >
                  View Product →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}