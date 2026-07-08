export type ProductCategorySection = {
  title: string;
  items: string[];
};

export type ProductCategory = {
  label: string;
  sections: ProductCategorySection[];
};

export const productCategories: ProductCategory[] = [
  {
    label: "Men's Wear",
    sections: [
      {
        title: 'Casual Wear',
        items: ['Shirts', 'T-shirts', 'Jeans', 'Trousers', 'Shorts', 'Track Pants', 'Jackets', 'Sweatshirts', 'Sweaters'],
      },
      {
        title: 'Work Wear',
        items: ['Formal Shirts', 'Smart Blazers', 'Formal Trousers', 'Coats', 'Ties', 'Formal Shoes'],
      },
      {
        title: 'Occasion Wear',
        items: ['Kurtas & Kurta Sets', 'Nehru Jackets', 'Sherwani', 'Kurta Sets', 'Ethnic Pajamas', 'Dhoti Pants', 'Ethnic Blazers'],
      },
      {
        title: 'Sports Wear',
        items: ['T-shirts', 'Track Pants', 'Jackets', 'Shorts', 'Sweatshirts', 'Tracksuits'],
      },
    ],
  },
  {
    label: "Women's Wear",
    sections: [
      {
        title: 'Western Wear',
        items: ['Dresses', 'Tops', 'Jeans', 'Trousers', 'T-shirts', 'Shirts', 'Co-ords', 'Skirts & Shorts', 'Jumpsuits'],
      },
      {
        title: 'Ethnic Wear',
        items: ['Kurta Sets', 'Kurtas', 'Sarees', 'Ethnic Dresses', 'Fusion Wear', 'Ethnic Tops', 'Lehenga Choli', 'Co-ords'],
      },
      {
        title: 'Lingerie & Loungewear',
        items: ['Bras', 'Night Suits', 'Night Dress', 'Briefs', 'Lounge Pants', 'Shapewear'],
      },
      {
        title: 'Sports Wear',
        items: ['T-shirts', 'Track Pants', 'Jackets', 'Shorts', 'Sweatshirts', 'Tracksuits'],
      },
    ],
  },
  {
    label: 'Kids Wear',
    sections: [
      {
        title: 'For Infants',
        items: ['Clothing Sets', 'Bodysuits', 'Tops & T-shirts', 'Bottomwear', 'Dresses', 'Nightsuits', 'Shorts', 'Innerwear & Sleepwear', 'Rompers & Sleepsuits'],
      },
      {
        title: 'For Girls',
        items: ['Dresses', 'Tops & T-shirts', 'Clothing Sets', 'Shorts & Skirts', 'Nightsuits', 'Jeans & Trousers', 'Kurta Sets', 'Lehenga Choli', 'Footwear'],
      },
      {
        title: 'For Boys',
        items: ['T-shirts', 'Clothing Sets', 'Track Pants & Pajamas', 'Jeans & Trousers', 'Shirts', 'Nightsuits', 'Kurta Sets Suits & Blazers', 'Footwear'],
      },
      {
        title: 'For Teens',
        items: ['Dresses', 'Tops & T-shirts', 'Kurta Sets', 'Jeans & Trousers', 'Shorts & Skirts', 'Footwear'],
      },
    ],
  },
  {
    label: 'Footwear',
    sections: [
      {
        title: "Women's Footwear",
        items: ['Heels', 'Flats', 'Casual Shoes', 'Flip Flops', 'Boots', 'Sports Shoes'],
      },
      {
        title: "Men's Footwear",
        items: ['Casual Shoes', 'Sports Shoes', 'Formal Shoes', 'Sandals', 'Flip Flops', 'Boots'],
      },
    ],
  },
  {
    label: 'Beauty & Grooming',
    sections: [
      {
        title: 'Grooming',
        items: ['Shaving Essentials', 'Trimmer', 'Bath & Body Care'],
      },
      {
        title: 'Fragrances',
        items: ['Perfume', 'Deodorant', 'Body Mist'],
      },
      {
        title: 'Hair Care',
        items: ['Shampoo', 'Hair Color', 'Hair Serum', 'Conditioner', 'Hair Appliance', 'Hair Mask'],
      },
      {
        title: 'Skin Care',
        items: ['Facewash & Cleanser', 'Day Cream', 'Sunscreen', 'Serum & Gel', 'Mask & Peel', 'Body Lotion', 'Body Wash', 'Lip Care', 'Toner'],
      },
      {
        title: 'Makeup',
        items: ['Lipstick', 'Foundation', 'Compact', 'Concealer', 'Primer', 'Mascara', 'Eyeshadow', 'Eyeliner'],
      },
    ],
  },
  {
    label: 'Accessories',
    sections: [
      {
        title: "Men's Accessories",
        items: ['Trolleys', 'Backpacks', 'Watches', 'Wallets', 'Belts', 'Sunglasses'],
      },
      {
        title: "Women's Accessories",
        items: ['Handbags', 'Wallets', 'Clutches', 'Jewellery'],
      },
    ],
  },
];

export const getProductCategory = (label: string) =>
  productCategories.find((category) => category.label === label);

export const getProductCategorySection = (
  categoryLabel: string,
  sectionTitle: string
) =>
  getProductCategory(categoryLabel)?.sections.find(
    (section) => section.title === sectionTitle
  );
