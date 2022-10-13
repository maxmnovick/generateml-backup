// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { ProductImport, ProductDetails } = initSchema(schema);

export {
  ProductImport,
  ProductDetails
};