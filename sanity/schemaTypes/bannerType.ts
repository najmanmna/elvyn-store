import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const bannerType = defineType({
  name: "banner",
  title: "Banner",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
  name: "desktop",
  title: "Desktop",
  type: "object",
  fields: [
    { name: "image", title: "Image", type: "image", options: { hotspot: true } },
    {
      name: "buttonTheme",
      title: "Button Theme",
      type: "string",
      options: {
        list: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
        ],
        layout: "radio",
      },
      initialValue: "dark",
    },
  ],
}),
defineField({
  name: "mobile",
  title: "Mobile",
  type: "object",
  fields: [
    { name: "image", title: "Image", type: "image", options: { hotspot: true } },
    {
      name: "buttonTheme",
      title: "Button Theme",
      type: "string",
      options: {
        list: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
        ],
        layout: "radio",
      },
      initialValue: "dark",
    },
  ],
}),

  ],
  preview: {
    select: {
      title: "name",
      media: "desktopImage", // 👈 preview desktop image in Studio
    },
    prepare({ title, media }) {
      return {
        title,
        media,
      };
    },
  },
});
