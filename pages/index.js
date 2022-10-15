import { API, autoShowTooltip, DataStore } from "aws-amplify";
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

  const [jsonRows, setJsonRows] = useState([{ text: 'Learn Hooks' }]);

  const [importRows, setImportRows] = useState([])

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

  //excel import
  const [tableData, setTableData] = useState([]);

  const convertToJson = async (headers, data) => {
    //debugger;
    const rows = [];
    data.forEach(async row => {
      let rowData = {};
      row.forEach(async (element, index) => {
        rowData[headers[index]] = element;
      });
      console.log("rowData--->", rowData);
      rows.push(rowData);
    });
    console.log('rows', rows);

    setTableData(rows);
    setJsonRows(rows);
    //const str = "tableData: " + tableData
    //console.log(tableData);

    return(rows);
  };

  // const assignToCatalog = async (data_rows) => {
  //   const catalog_rows = [];

  // };

  // at the end we want to have the useState variables assigned before processing
  const assignVarsToModel = async (headers, data_rows) => {
    // find sku column
    // look for keywords like sku or item#
    // find collection column with collection keyword
    // find type column with description keyword
    sku_column_name = 'sku'
    for (h in headers){
      console.log(h)
    }
    //should we pass this to python for processing to get the fields sorted? yes!

  };

  //import excel
  const uploadToClient = async (e) => {
    try {
      if (e.target.files && e.target.files[0]) {

        const file = e.target.files[0];
        console.log(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          const bstr = event.target.result;
          console.log(bstr);
          const workBook = XLSX.read(bstr, { type: "binary" });
          console.log(workBook);
          const workSheetName = workBook.SheetNames[0];
          console.log(workSheetName);
          const workSheet = workBook.Sheets[workSheetName];
          console.log(workSheet);
          const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
          console.log(fileData);
          const headers = fileData[0];
          console.log(headers);
          const heads = headers.map(head => ({ title: head, field: head }));
          console.log(heads);
          fileData.splice(0, 1);
          console.log(fileData);
          convertToJson(headers, fileData);
        }
        reader.readAsBinaryString(file);

        // sort out the input files so we get the fields we need
        // for example a vendor gives us extra fields with non standard names so we look for keywords and the result is the standardized catalog


        // assign vars from excel to data model
        // for each row in table
        // setSku();
        // setCollection();
        // setType();
        //assignVarsToModel(headers, jsonRows);
        

        // [ [ data, from, file, 1 ], [data, from, file, 2 ] ]
        // or JSON {}
        // send vars from data model to generate product
        // OR
        // send vars direct from excel to generate product
        
        // we only need to get back the vendor catalog if we want to display it
        // but for now just return the product import to avoid the extra steps
        // const vendor_catalog = await API.get('productgeneratorapi', '/product', init_vendor_data) // list of each row not including header row
        // const myInit = {
        //   queryStringParameters: {
        //     submit_type: 'bulk', // so return a list
        //     collection: vendor_catalog,
        //     type: type
        //   }
        // };
        // once we have the data we pass it to processing
        //const all_final_item_info = await API.get('productgeneratorapi','/product', init_vendor_data);
        
        // const init_vendor_data = {
        //   queryStringParameters: {
        //     submit_type: 'file',
        //     //vendor_product_data: tableData // vendor product data is raw data from vendor fed to generate catalog fcn
        //     vendor_product_json: jsonRows
        //   }
        // };
        // const vendor_product_import = await API.get('productgeneratorapi', '/product', init_vendor_data) // list of each row not including header row
        // //const handle = await API.get('productgeneratorapi','/product', myInit);
        // console.log({vendor_product_import});
        
        //handles = vendor_product_import['handles']
        // save data for each product or can we instead display it directly and make xlsx file download?
        // vendor_product_import.forEach(async product => {
        //   await DataStore.save(
        //     new ProductImport({
        //       Handle: product['handle'],
        //       Title: product['title'],
        //       Variant_SKU: product['sku']
        //     })
        //   );
        // });
        
      }
    } catch(err) {
      console.log(err);
    }
  };

  const uploadToServer = async () => {
    try {
      console.log(jsonRows[0]['Collection Name']);
      const myInit = {
        queryStringParameters: {
          submit_type: 'file',
          collection: jsonRows[0]['Collection Name'],
          type: 'type example',
          vendor_product_json: JSON.stringify(jsonRows)
        }
      };
      // get the output data ready for import
      // we know the indexes in standard format so we save their values
      // handle_idx = 0
      // const all_final_item_info = await API.get('productgeneratorapi','/product', myInit);
      // handle = all_final_item_info[handle_idx]
      const rows = await API.get('productgeneratorapi','/product', myInit);
      //const handle = 'handle'
      console.log({ rows });
      // gen worksheet and workbook
      setImportRows(rows);
      


      // const data = {
      //   Data1: [
      //     { name: 'gfg1', category: 'gfg4' },
      //     { name: 'gfg2', category: 'gfg5' },
      //     { name: 'gfg3', category: 'gfg6' },
      //   ],
      //   // Worksheet named pokemons
      //   Data2: [
      //     { name: 'gfg1', category: 'gfg1' },
      //     { name: 'gfg1', category: 'gfg1' },
      //     { name: 'gfg1', category: 'gfg1' },
      //   ],
      // };
      // setImportRows(data);

      document.getElementById('import_json').innerHTML = JSON.stringify(rows);
      
      //console.log("Post saved successfully!");
    } catch(e) {
      console.log(e);
    }
  };



  // save manually
  const saveProduct = async () => {
    try {
      const myInit = {
        queryStringParameters: {
          submit_type: 'form',
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



  const xport = async () => {
    try {
      // go from json to workbook
      // can also go from table to workbook with table_to_book(table)
      const import_worksheet = XLSX.utils.json_to_sheet(importRows);
      const import_workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(import_workbook, import_worksheet, "Products");

      //fix headers
      XLSX.utils.sheet_add_aoa(import_worksheet, [["Handle", "Title", "Variant SKU"]], { origin: "A1" });

      // calc column width
      // const max_width = importRows.reduce((w, r) => Math.max(w, r.name.length), 10);
      // import_worksheet["!cols"] = [ { wch: max_width } ];

      XLSX.writeFile(import_workbook, "Product-Import.xlsx");
    
    } catch(err) {
      console.log(err);
    }
      
  };

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
      <button
          className="btn btn-primary"
          type="submit"
          onClick={uploadToServer}
        >
          Send to server
        </button>
      {/* <a href="Product-Import.xlsx" download>Download Product Import</a> */}
      <button onClick={xport}>Download Product Import</button>

      <pre id="import_json"></pre>

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