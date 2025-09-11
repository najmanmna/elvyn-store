import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // 🔹 Variants: each color has stock + images
    defineField({
      name: "variants",
      title: "Product Variants",
      type: "array",
      of: [
        {
          type: "object",
          name: "variant",
          fields: [
            defineField({
              name: "colorName",
              title: "Color Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "stock",
              title: "Stock for this color",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "images",
              title: "Images for this color",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              title: "colorName",
              subtitle: "stock",
              media: "images.0",
            },
            prepare({ title, subtitle, media }) {
              return {
                title,
                subtitle: `Stock: ${subtitle || 0}`,
                media,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),

    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),

    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Hot", value: "hot" },
          { title: "Best", value: "best" },
        ],
      },
    }),

    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Toggle to Featured on or off",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "variants.0.images.0",
      subtitle: "price",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `LKR ${subtitle.toLocaleString("en-LK")}` : "",
        media,
      };
    },
  },
});
