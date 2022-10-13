import { API, DataStore } from "aws-amplify";
import React, { useState } from "react";
import { ProductDetails, ProductImport } from "../src/models";
import { CatalogHeaders, CatalogRows, ImportHeaders, ImportRows, ProductDetailsForm } from "../src/ui-components";
//const {spawn} = require("child_process");
import * as XLSX from 'xlsx';

export default function Home() {

  const [sku, setSku] = useState("");
  const [collection, setCollection] = useState("");
  const [type, setType] = useState("");

  const [handle, setHandle] = useState("");
  const [title, setTitle] = useState("");

  // const data_to_pass_in = {
  //   data_sent: 'data sent',
  //   data_returned: undefined
  // }
  
  // const python_process = spawn('python3',['api/product-generator-test.py',JSON.stringify(data_to_pass_in), 'js'])
  // python_process.stdout.on('data', (data) => {
  //   console.log("data received: ", JSON.parse(data.toString()))
  // });

  const uploadTsv = async () => {
    try {

    } catch(e) {
      console.log(e);
    }
  }

  //import excel
  const uploadToClient = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        const bstr = event.target.result
        console.log(bstr)
        const workBook = XLSX.read(bstr, { type: "binary" })
        console.log(workBook)
        const workSheetName = workBook.SheetNames[0]
        console.log(workSheetName)
        const workSheet = workBook.Sheets[workSheetName]
        console.log(workSheet)
        const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 })
        console.log(fileData)
      }
      reader.readAsBinaryString(file)

      // [ [ data, from, file, 1 ], [data, from, file, 2 ] ]
      // or JSON {}
      const init_vendor_data = {
        queryStringParameters: {
          vendor_product_data: tableData // vendor product data is raw data from vendor fed to generate catalog fcn
        }
      }

      // once we have the data we pass it to processing
      const all_final_item_info = await API.get('productgeneratorapi','/product', init_vendor_data);
    }
  };



  // save manually

  const saveProduct = async () => {
    try {
      const myInit = {
        queryStringParameters: {
          collection: collection,
          type: type
        }
      };
      // get the output data ready for import
      // we know the indexes in standard format so we save their values
      // handle_idx = 0
      // const all_final_item_info = await API.get('productgeneratorapi','/product', myInit);
      // handle = all_final_item_info[handle_idx]
      const handle = await API.get('productgeneratorapi','/product', myInit);
      //const handle = 'handle'
      console.log({ handle });

      await DataStore.save(
        new ProductDetails({
          SKU: sku,
          Collection: collection,
          Type: type
        })
      );
      await DataStore.save(
        new ProductImport({
          Handle: handle,
          Title: (function setTitle(c, t) {
            return c + " " + t
          })(collection, type),
          Variant_SKU: sku
        })
      );

      
      //console.log("Post saved successfully!");
    } catch(e) {
      console.log(e);
    }
  }

  const addProductOverrides = {
    "TextField34462690": {
      onChange: (event) => {
        setSku(event.target.value);
      }
    },
    "TextField34462697": {
      onChange: (event) => {
        setCollection(event.target.value);
      }
    },
    "TextField34462704": {
      onChange: (event) => {
        setType(event.target.value);
      }
    },
    "Button": {
      onClick: saveProduct
    }
  }

  

  return (
    <div className="App">
      <label htmlFor="product_data">Upload Product Data:</label>
      <input type="file"
            id="product_data" name="product_data"
            accept=".xlsx,.xls,.tsv,.csv"
            onChange={uploadToClient}/> 

      <ProductDetailsForm overrides={addProductOverrides}/>
      <div className="row">
        <div className="column">
          <CatalogHeaders />
          <CatalogRows />
        </div>
        <div className="column">
          <ImportHeaders />
          <ImportRows />
        </div>
      </div>

      
    </div>
  );
}