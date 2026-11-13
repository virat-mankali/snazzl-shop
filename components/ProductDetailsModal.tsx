import { useEffect, useId, useRef, useState } from 'react';
import { ConvexError } from 'convex/values';
import { ImageOff, Pencil, Trash2, X } from 'lucide-react';

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
  listingStatus?: 'unpublished';
};

export type ListingAction = 'published' | 'unpublished' | 'deleted';

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

export default function ProductDetailsModal({
  product,
  salePrice,
  onClose,
  onEdit,
  onListingAction,
}: {
  product: ProductRecord;
  salePrice: number | null;
  onClose: () => void;
  onEdit: () => void;
  onListingAction: (status: ListingAction) => Promise<void>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const confirmationTitleId = useId();
  const confirmationDescriptionId = useId();
  const [pending, setPending] = useState<ListingAction | null>(null);
  const [error, setError] = useState('');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const unpublished = product.listingStatus === 'unpublished';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  async function changeListing(status: ListingAction) {
    setPending(status);
    setError('');
    try {
      await onListingAction(status);
      confirmRef.current?.close();
      if (status === 'deleted') dialogRef.current?.close();
    } catch (error) {
      setError(error instanceof ConvexError && typeof error.data === 'string'
        ? error.data
        : 'Could not update the product. Please try again.');
    } finally {
      setPending(null);
    }
  }

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
      onCancel={(event) => { if (pending) event.preventDefault(); }}
      onClick={(event) => {
        if (!pending && event.target === event.currentTarget) event.currentTarget.close();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl overscroll-contain rounded-2xl border border-neutral-200 bg-white p-0 text-neutral-900 shadow-xl backdrop:bg-black/50"
    >
      <header className="sticky top-0 z-10 flex flex-wrap items-start justify-between gap-3 border-b border-neutral-200 bg-white px-5 py-4 sm:px-6">
        <div className="min-w-0 flex-1 basis-32">
          <h2 id={titleId} className="wrap-anywhere text-xl font-semibold">{product.product_name}</h2>
          {unpublished && <p className="mt-1 text-sm text-neutral-600">Unpublished · Hidden from customers</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {unpublished && (
            <button
              type="button"
              disabled={pending !== null}
              onClick={() => void changeListing('published')}
              className="rounded-lg bg-[#171717] px-3 py-2 text-sm font-medium text-white hover:bg-[#404040] disabled:opacity-60"
            >
              {pending === 'published' ? 'Publishing…' : 'Publish'}
            </button>
          )}
          <button
            type="button"
            aria-haspopup="dialog"
            disabled={pending !== null}
            onClick={() => {
              setError('');
              setConfirmationOpen(true);
              confirmRef.current?.showModal();
              cancelRef.current?.focus();
            }}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            <Trash2 size={14} aria-hidden="true" />
            Delete
          </button>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={onEdit}
            disabled={pending !== null}
            className="flex items-center gap-2 rounded-lg bg-[#171717] px-3 py-2 text-sm font-medium text-white hover:bg-[#404040]"
          >
            <Pencil size={14} aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            aria-label="Close product details"
            disabled={pending !== null}
            onClick={() => dialogRef.current?.close()}
            className="shrink-0 rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {error && !confirmationOpen && <p role="alert" className="w-full text-sm text-red-700">{error}</p>}
      </header>

      <dialog
        ref={confirmRef}
        aria-labelledby={confirmationTitleId}
        aria-describedby={confirmationDescriptionId}
        onClose={(event) => {
          event.stopPropagation();
          setConfirmationOpen(false);
          setError('');
        }}
        onCancel={(event) => { if (pending) event.preventDefault(); }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-neutral-200 bg-white p-5 text-neutral-900 shadow-xl backdrop:bg-black/50 sm:p-6"
      >
        <h3 id={confirmationTitleId} className="text-lg font-semibold">
          {unpublished ? 'Delete this product?' : 'Unpublish or delete this product?'}
        </h3>
        <p id={confirmationDescriptionId} className="mt-2 wrap-anywhere text-sm text-neutral-600">
          {unpublished
            ? `${product.product_name} is already hidden from customers. Deleting it removes it from your Products list permanently.`
            : `Unpublish ${product.product_name} to hide it from customers and bring it back anytime. Deleting it permanently removes it from your Products list.`}
        </p>
        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {!unpublished && (
            <button type="button" disabled={pending !== null} onClick={() => void changeListing('unpublished')}
              className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-60">
              {pending === 'unpublished' ? 'Unpublishing…' : 'Unpublish'}
            </button>
          )}
          <button type="button" disabled={pending !== null} onClick={() => void changeListing('deleted')}
            className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60">
            {pending === 'deleted' ? 'Deleting…' : 'Delete permanently'}
          </button>
          <button ref={cancelRef} type="button" disabled={pending !== null} onClick={() => confirmRef.current?.close()}
            className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 disabled:opacity-60 sm:col-span-2">
            Cancel
          </button>
        </div>
      </dialog>

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
