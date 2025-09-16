import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { bannerType } from "./bannerType";
import { brandType } from "./brandTypes";
import { authorType } from "./authType";
import { addressType } from "./addressType";
import { settingsType } from "./settings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
      settingsType,
    blockContentType,
    categoryType,
    productType,
    orderType,
    bannerType,
    brandType,
    authorType,
    addressType,
  ],
};
