import { useEffect, useId, useRef } from 'react';
import { ImageOff, Pencil, X } from 'lucide-react';

export const photoViews = [
  ['cover_image', 'Cover'],
  ['front_image', 'Front'],
  ['left_image', 'Left'],
  ['back_image', 'Back'],
  ['right_image', 'Right'],
] as const;

export type ProductRecord = {
  _id: string;
  product_name: string;
  product_description: string;
  product_images?: Partial<Record<(typeof photoViews)[number][0], string | null>>;
  brand_store: string;
  category?: {
    main_category?: string;
    sub_category?: string;
    sub_sub_category?: string;
  };
  price: {
    base_price: number;
    discount: number;
  };
  stock?: number;
  material: string;
  size: { fit: string; available_sizes: number[] };
  colors: { name: string; picker: string }[];
  createdAt: number;
};

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

export default function ProductDetailsModal({
  product,
  salePrice,
  onClose,
  onEdit,
}: {
  product: ProductRecord;
  salePrice: number | null;
  onClose: () => void;
  onEdit: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const photos = photoViews.flatMap(([key, label]) => {
    const url = product.product_images?.[key];
    return url ? [{ key, label, url }] : [];
  });
  const categoryPath = [
    product.category?.main_category,
    product.category?.sub_category,
    product.category?.sub_sub_category,
  ].filter(Boolean).join(' / ');

  const details = [
    ['Store', product.brand_store],
    ['Category', categoryPath],
    ['Base price', currency.format(product.price.base_price)],
    ['Discount', `${product.price.discount}%`],
    ['Selling price', currency.format(salePrice ?? product.price.base_price)],
    ['Stock', product.stock],
    ['Material', product.material],
    ['Fit', product.size?.fit],
    ['Available sizes', product.size?.available_sizes?.join(', ')],
    ['Added on', product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : undefined],
    ['Product ID', product._id],
  ];

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl overscroll-contain rounded-2xl border border-neutral-200 bg-white p-0 text-neutral-900 shadow-xl backdrop:bg-black/50"
    >
      <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-neutral-200 bg-white px-5 py-4 sm:px-6">
        <h2 id={titleId} className="min-w-0 wrap-anywhere text-xl font-semibold">{product.product_name}</h2>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg bg-[#171717] px-3 py-2 text-sm font-medium text-white hover:bg-[#404040]"
          >
            <Pencil size={14} aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            aria-label="Close product details"
            onClick={() => dialogRef.current?.close()}
            className="shrink-0 rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="grid grid-cols-2 content-start gap-3">
          {photos.map(({ key, label, url }, index) => (
            <figure key={key} className={index === 0 ? 'col-span-2' : ''}>
              {/* Use the media URL returned by Convex directly, including legacy storage URLs. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`${label} photo of ${product.product_name}`}
                loading={index === 0 ? 'eager' : 'lazy'}
                className="aspect-square w-full rounded-lg border border-neutral-200 bg-neutral-50 object-contain"
              />
              <figcaption className="mt-1 text-xs text-neutral-500">{label}</figcaption>
            </figure>
          ))}
          {photos.length === 0 && (
            <div className="col-span-2 flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 text-sm text-neutral-500">
              <ImageOff size={24} aria-hidden="true" />
              No product photos
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-5">
          <section>
            <h3 className="text-sm font-semibold">Description</h3>
            <p className="mt-1 wrap-anywhere text-sm leading-relaxed whitespace-pre-wrap text-neutral-700">
              {product.product_description?.trim() || 'No description provided.'}
            </p>
          </section>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm">
            {details.map(([label, value]) => (
              <div key={label} className={label === 'Product ID' ? 'col-span-2' : undefined}>
                <dt className="text-xs text-neutral-600">{label}</dt>
                <dd className="mt-0.5 wrap-anywhere font-medium">{value === '' || value == null ? '—' : value}</dd>
              </div>
            ))}
          </dl>

          <section>
            <h3 className="text-sm font-semibold">Colors</h3>
            {product.colors?.length ? (
              <ul className="mt-2 flex flex-wrap gap-2">
                {product.colors.map(({ name, picker }, index) => (
                  <li key={index} className="flex min-w-0 items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 text-sm">
                    <span
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/15"
                      style={{ backgroundColor: picker }}
                    />
                    <span className="wrap-anywhere">{name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-neutral-600">No colors listed.</p>
            )}
          </section>
        </div>
      </div>
    </dialog>
  );
}
