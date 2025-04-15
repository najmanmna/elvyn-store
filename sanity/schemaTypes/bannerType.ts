import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const bannerType = defineType({
  name: "banner",
  title: "Banner",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Banner Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "name",
      },
    }),
    defineField({
      name: "description",
      title: "Sale Description",
      type: "text",
    }),
    defineField({
      name: "badge",
      title: "Discount Badge",
      type: "string",
      description: "Discount Badge Ratio",
    }),
    defineField({
      name: "discountAmount",
      title: "Discount Amount",
      type: "number",
      description: "Amount off in percentage or fixed value",
    }),
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
      // discountAmount: "discountAmount",
      // couponCode: "couponCode",
    },
    prepare(select) {
      const {
        title,
        media,
        // discountAmount, couponCode
      } = select;

      return {
        title,
        media,
        // subtitle: `${discountAmount}% off - Code: ${couponCode}`,
      };
    },
  },
});
