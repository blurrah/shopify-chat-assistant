import { RemoteComponent } from 'remote-components/next';
import { Button } from '../../../../components/ui/button';

export default async function ProductCard({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;

    const productData = JSON.parse(decodeURIComponent(name));

    return (
        <RemoteComponent name='product-card'>
            <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors h-full flex flex-col">
                <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
                    alt="Premium Wireless Headphones"
                    className="w-full h-48 rounded-md object-cover mb-3"
                />

                <div className="space-y-2 flex-1 flex flex-col">
                    <h5 className="font-medium text-sm line-clamp-2">{productData.name}</h5>

                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-base">
                            Between $99.99 and $149.99
                        </span>
                    </div>

                    <p className="text-muted-foreground text-xs line-clamp-3">
                        High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.
                    </p>

                    <div className="flex flex-col gap-2 mt-auto">
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm font-medium inline-block"
                        >
                            View Product →
                        </a>
                        <Button
                            size="sm"
                            className="w-full"
                        >
                            Add to Cart
                        </Button>
                        <Button
                            size="sm"
                            className="w-full"
                            variant="outline"
                        >
                            Get product details
                        </Button>
                    </div>
                    </div>
                </div>
        </RemoteComponent>
    );
}