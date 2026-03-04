import { memo } from 'react';
import { useQuery } from 'convex/react';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  sold: number;
}

function ProductCard({ name, image, price, salePrice, stock, sold }: ProductCardProps) {
  // Get image URL from Convex storage if it's a storage ID
  const imageUrl = useQuery('products:getImageUrl' as any, 
    image && !image.startsWith('http') ? { storageId: image } : 'skip'
  );
  
  const displayImage = imageUrl || image;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-gray-100">
        <img 
          src={displayImage} 
          alt={name}
          className="w-full h-full object-cover"
        />
        {salePrice && (
          <div className="absolute top-3 right-3 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">Sale</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-black mb-2">{name}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          {salePrice ? (
            <>
              <span className="text-gray-400 line-through text-sm">₹{price}</span>
              <span className="text-black font-semibold">₹{salePrice}</span>
            </>
          ) : (
            <span className="text-black font-semibold">₹{price}</span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-gray-600">Stock: </span>
            <span className="text-black font-medium">{stock}</span>
          </div>
          <div>
            <span className="text-gray-600">Sold: </span>
            <span className="text-black font-medium">{sold}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
