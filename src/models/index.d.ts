import { ModelInit, MutableModel } from "@aws-amplify/datastore";

type ProductImportMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ProductDetailsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class ProductImport {
  readonly id: string;
  readonly Handle?: string | null;
  readonly Title?: string | null;
  readonly Variant_SKU?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ProductImport, ProductImportMetaData>);
  static copyOf(source: ProductImport, mutator: (draft: MutableModel<ProductImport, ProductImportMetaData>) => MutableModel<ProductImport, ProductImportMetaData> | void): ProductImport;
}

export declare class ProductDetails {
  readonly id: string;
  readonly SKU?: string | null;
  readonly Collection?: string | null;
  readonly Type?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ProductDetails, ProductDetailsMetaData>);
  static copyOf(source: ProductDetails, mutator: (draft: MutableModel<ProductDetails, ProductDetailsMetaData>) => MutableModel<ProductDetails, ProductDetailsMetaData> | void): ProductDetails;
}