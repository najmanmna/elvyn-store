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
          { title: "New Arrival", value: "new" },
          { title: "Hot Selling", value: "hot" },
          { title: "Best Deal", value: "best" },
        ],
      },
    }),

    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      description: "Toggle to display in Home Page under EXCLUSIVE COLLECTION",
      initialValue: false,
    }),

    defineField({
  name: "features",
  title: "Features",
  type: "array",
  of: [
    {
      type: "object",
      fields: [
        {
          name: "icon",
          title: "Icon",
          type: "image",
          options: { hotspot: true },
        },
        {
          name: "label",
          title: "Label",
          type: "string",
        },
      ],
      preview: {
        select: { title: "label", media: "icon" },
      },
    },
  ],
  description: "Feature highlights shown above description (with icon + label)",
}),
defineField({
  name: "specifications",
  title: "Specifications",
  type: "array",
  of: [
    {
      type: "object",
      fields: [
        {
          name: "icon",
          title: "Icon",
          type: "image",
          options: { hotspot: true },
        },
        {
          name: "value",
          title: "Value",
          type: "string", // e.g. 27 cm, Leather, 15L
        },
      ],
      preview: {
        select: { title: "label", subtitle: "value" },
      },
    },
  ],
  description: "Detailed product specifications shown below description",
}),
defineField({
  name: "realImages",
  title: "Real Images",
  type: "array",
  of: [{ type: "image", options: { hotspot: true } }],
  description: "Upload real photos of the product",
}),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
defineField({
  name: "realVideos",
  title: "Real Videos",
  type: "array",
  of: [
    {
      type: "file",
      options: {
        accept: "video/*", // restricts upload to video formats
      },
    },
  ],
  description: "Upload real product videos (mp4, mov, etc.)",
}),


  ],

  preview: {
    select: {
      title: "name",
      media1: "variants.0.images.0",
      subtitle: "price",
    },
    prepare({ title, subtitle, media1 }) {
      return {
        title,
        subtitle: subtitle ? `LKR ${subtitle.toLocaleString("en-LK")}` : "",
        media1,
      };
    },
  },
});
