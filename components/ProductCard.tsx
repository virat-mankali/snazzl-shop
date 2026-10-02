import { memo } from 'react';

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

function ProductCard({
  name,
  image,
  price,
  salePrice,
  stock,
  sold,
  categoryPath,
}: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md">
      <div className="relative aspect-[4/3] bg-neutral-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {salePrice && (
          <div className="absolute right-3 top-3 rounded-full bg-[#171717] px-2.5 py-1 shadow-sm">
            <span className="text-xs font-semibold text-white">Sale</span>
          </div>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="line-clamp-1 text-sm font-semibold text-[#171717]">{name}</h3>
        {categoryPath ? (
          <p className="mt-1 line-clamp-1 text-[11px] font-medium text-neutral-500">
            {categoryPath}
          </p>
        ) : null}

        <div className="mt-2 flex items-center gap-2">
          {salePrice ? (
            <>
              <span className="text-xs text-neutral-400 line-through">₹{price}</span>
              <span className="text-sm font-semibold text-[#171717]">₹{salePrice}</span>
            </>
          ) : (
            <span className="text-sm font-semibold text-[#171717]">₹{price}</span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 text-xs">
          <div className="border-r border-neutral-200 px-3 py-2">
            <span className="block text-neutral-500">Stock</span>
            <span className="font-semibold text-neutral-900">{stock}</span>
          </div>
          <div className="px-3 py-2">
            <span className="block text-neutral-500">Sold</span>
            <span className="font-semibold text-neutral-900">{sold}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
