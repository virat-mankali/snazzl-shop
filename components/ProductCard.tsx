import { memo } from 'react';
import { useQuery } from 'convex/react';
import { makeFunctionReference } from 'convex/server';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  sold: number;
  categoryPath?: string;
}

const getImageUrl = makeFunctionReference<"query">("products:getImageUrl");

function ProductCard({
  name,
  image,
  price,
  salePrice,
  stock,
  sold,
  categoryPath,
}: ProductCardProps) {
  // Get image URL from Convex storage if it's a storage ID
  const imageUrl = useQuery(
    getImageUrl,
    image && !image.startsWith('http') ? { storageId: image } : 'skip'
  ) as string | null | undefined;

  const displayImage = imageUrl || image;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="relative aspect-[4/3] bg-slate-100">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover"
        />
        {salePrice && (
          <div className="absolute right-3 top-3 rounded-full bg-[#171719] px-2.5 py-1 shadow-sm">
            <span className="text-xs font-semibold text-white">Sale</span>
          </div>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="line-clamp-1 text-sm font-semibold text-[#171719]">{name}</h3>
        {categoryPath ? (
          <p className="mt-1 line-clamp-1 text-[11px] font-medium text-slate-500">
            {categoryPath}
          </p>
        ) : null}

        <div className="mt-2 flex items-center gap-2">
          {salePrice ? (
            <>
              <span className="text-xs text-slate-400 line-through">₹{price}</span>
              <span className="text-sm font-semibold text-[#171719]">₹{salePrice}</span>
            </>
          ) : (
            <span className="text-sm font-semibold text-[#171719]">₹{price}</span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-xs">
          <div className="border-r border-slate-200 px-3 py-2">
            <span className="block text-slate-500">Stock</span>
            <span className="font-semibold text-slate-900">{stock}</span>
          </div>
          <div className="px-3 py-2">
            <span className="block text-slate-500">Sold</span>
            <span className="font-semibold text-slate-900">{sold}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
