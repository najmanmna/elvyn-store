import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { orderItemType } from "./orderItem";
import { bannerType } from "./bannerType";
import subscribersType from "./subscribersType";

import { settingsType } from "./settings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
      settingsType,
    blockContentType,
    categoryType,
    productType,
    orderType,
orderItemType,
    bannerType,
    subscribersType

  ],
};
