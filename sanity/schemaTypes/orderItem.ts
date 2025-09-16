import { defineType, defineField } from "sanity";

export const orderItemType = defineType({
  name: "orderItem",
  title: "Order Item",
  type: "object",
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
    }),
    defineField({
      name: "quantity",
      title: "Quantity",
      type: "number",
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "price",
      title: "Unit Price",
      type: "number",
    }),
  ],
  preview: {
    select: {
      product: "product.name",
      quantity: "quantity",
      price: "price",
      image: "product.images.0",
    },
    prepare({ product, quantity, price, image }) {
      return {
        title: `${product} x${quantity}`,
        subtitle: `Rs. ${price * quantity}`,
        media: image,
      };
    },
  },
});
