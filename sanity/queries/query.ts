import { defineQuery } from "next-sanity";

// // 🔹 Banner
// const BANNER_QUERY = defineQuery(
//   `*[_type == 'banner'] | order(publishedAt desc)`
// );

// example in lib/queries.ts
const BANNER_QUERY = `*[_type == "banner"]{
  name,
  desktop { image, buttonTheme },
  mobile { image, buttonTheme }
}
  `;


// 🔹 Featured categories
const FEATURED_CATEGORY_QUERY = defineQuery(
  `*[_type == 'category' && featured == true] | order(name desc)`
);

// 🔹 All products (with variants)
const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type=="product"] | order(name asc){
    _id,
    name,
    slug,
    price,
    discount,
    status,
    isFeatured,
    categories[]->{
      title
    },
    variants[]{
      colorName,
      stock,
      images[]{asset->{url}}
    }
  }
`);

// 🔹 Hot Selling Products
const HOT_PRODUCTS_QUERY = defineQuery(`
  *[_type == 'product' && status == 'hot'] | order(name asc){
    _id,
    name,
    slug,
    price,
    discount,
    categories[]->{
      title
    },
    variants[]{
      colorName,
      stock,
      images[]{asset->{url}}
    }
  }
`);

// 🔹 Best Deals Products
const DEAL_PRODUCTS_QUERY = defineQuery(`
  *[_type == 'product' && status == 'sale'] | order(name asc){
    _id,
    name,
    slug,
    price,
    discount,
    categories[]->{
      title
    },
    variants[]{
      colorName,
      stock,
      images[]{asset->{url}}
    }
  }
`);

// 🔹 New Arrivals
const NEW_PRODUCTS_QUERY = defineQuery(`
  *[_type == 'product' && status == 'new'] | order(name asc){
    _id,
    name,
    slug,
    price,
    discount,
    categories[]->{
      title
    },
    variants[]{
      colorName,
      stock,
      images[]{asset->{url}}
    }
  }
`);

// 🔹 Featured Products
const FEATURE_PRODUCTS = defineQuery(`
  *[_type == 'product' && isFeatured == true] | order(name asc){
    _id,
    name,
    slug,
    price,
    discount,
    status,
    categories[]->{
      title
    },
    variants[]{
      colorName,
      stock,
      images[]{asset->{url}}
    }
  }
`);

// 🔹 Address
const ADDRESS_QUERY = defineQuery(
  `*[_type=="address"] | order(publishedAt desc)`
);

// 🔹 All Categories
const ALLCATEGORIES_QUERY = defineQuery(
  `*[_type == 'category'] | order(name asc)[0...$quantity]`
);


// 🔹 Single Product By Slug (with variants)
const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    description,
    price,
    discount,
    status,
    isFeatured,
    categories[]->{
      _id,
      title
    },
    variants[] {
      colorName,
      stock,
      images[] {
        asset->{url}
      }
    },
    features[] {
      label,
      icon {
        asset->{url}
      }
    },
    specifications[] {
      value,
      icon {
        asset->{url}
      }
    },
    realImages[] {
      asset->{url}
    },
    realVideos[] {
      asset->{url}
    }
  }
`);


export {
  BANNER_QUERY,
  FEATURED_CATEGORY_QUERY,
  ALL_PRODUCTS_QUERY,
  HOT_PRODUCTS_QUERY,
  DEAL_PRODUCTS_QUERY,
  NEW_PRODUCTS_QUERY,
  FEATURE_PRODUCTS,
  ADDRESS_QUERY,
  ALLCATEGORIES_QUERY,
  PRODUCT_BY_SLUG_QUERY,

};
