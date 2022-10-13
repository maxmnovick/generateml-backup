/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import React from "react";
import { ProductDetails } from "../models";
import {
  getOverrideProps,
  useDataStoreBinding,
} from "@aws-amplify/ui-react/internal";
import CatalogRow from "./CatalogRow";
import { Collection } from "@aws-amplify/ui-react";
export default function CatalogRows(props) {
  const { items: itemsProp, overrideItems, overrides, ...rest } = props;
  const itemsDataStore = useDataStoreBinding({
    type: "collection",
    model: ProductDetails,
  }).items;
  const items = itemsProp !== undefined ? itemsProp : itemsDataStore;
  return (
    <Collection
      type="list"
      direction="column"
      justifyContent="stretch"
      items={items || []}
      {...rest}
      {...getOverrideProps(overrides, "CatalogRows")}
    >
      {(item, index) => (
        <CatalogRow
          productDetails={item}
          key={item.id}
          {...(overrideItems && overrideItems({ item, index }))}
        ></CatalogRow>
      )}
    </Collection>
  );
}
