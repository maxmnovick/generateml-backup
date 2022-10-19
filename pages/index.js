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
  const [allItemJson, setAllItemJson] = useState([]);

  const [importRows, setImportRows] = useState([])

  // const data_to_pass_in = {
  //   data_sent: 'data sent',
  //   data_returned: undefined
  // }
  
  // const python_process = spawn('python3',['api/product-generator-test.py',JSON.stringify(data_to_pass_in), 'js'])
  // python_process.stdout.on('data', (data) => {
  //   console.log("data received: ", JSON.parse(data.toString()))
  // });

  // const uploadTsv = async () => {
  //   try {

  //   } catch(e) {
  //     console.log(e);
  //   }
  // }
  // // const assignToCatalog = async (data_rows) => {
  // //   const catalog_rows = [];

  // // };

  // // at the end we want to have the useState variables assigned before processing
  // const assignVarsToModel = async (headers, data_rows) => {
  //   // find sku column
  //   // look for keywords like sku or item#
  //   // find collection column with collection keyword
  //   // find type column with description keyword
  //   sku_column_name = 'sku'
  //   for (h in headers){
  //     console.log(h)
  //   }
  //   //should we pass this to python for processing to get the fields sorted? yes!

  // };

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

  

  //import excel
  const uploadToClient = async (e) => {
    try {
      const files = e.target.files
      
      if (files && files[0]) {
        var allJsonRows = []
        const num_files = files.length
        console.log('num_files: ', num_files)
        for (let file_num = 0; file_num <num_files; file_num++){
          console.log('File in loop: ', files[file_num])
          // if (file && files[file]){
          //   console.log('File: ', files[file])
          // }
          console.log('file num: ', file_num);
          const read_file = files[file_num];
          //console.log('single file: ', file);
          const reader = new FileReader();
          reader.onload = async (event) => {
            const bstr = event.target.result;
            //console.log(bstr);
            const workBook = XLSX.read(bstr, { type: "binary" });
            //console.log(workBook);
            const workSheetName = workBook.SheetNames[0];
            //console.log(workSheetName);
            const workSheet = workBook.Sheets[workSheetName];
            //console.log(workSheet);
            const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
            //console.log(fileData);
            const headers = fileData[0];
            //console.log(headers);
            const heads = headers.map(head => ({ title: head, field: head }));
            //console.log(heads);
            fileData.splice(0, 1);
            //console.log(fileData);
            //allJsonRows.push(convertToJson(headers, fileData));
            const jsonRows = await convertToJson(headers, fileData);
            allJsonRows.push(jsonRows);
          }
          reader.readAsBinaryString(read_file);

          
        }
        console.log("allJsonRows: ", allJsonRows)
        setAllItemJson(allJsonRows);

        // sort out the input files so we get the fields we need
        // for example a vendor gives us extra fields with non standard names so we look for keywords and the result is the standardized catalog
        
      }
    } catch(err) {
      console.log(err);
    }
  };

  const uploadToServer = async () => {
    try {
      const myInit = {
        queryStringParameters: {
          submit_type: 'file',
          vendor_product_json: JSON.stringify(allItemJson) 
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

      // get html table
      var import_table_preview = document.getElementById("import_table");
      //import_table_preview.innerHTML = "";
      let text = ""
      //print table headers
      const import_headers = ["Handle", "Title", "Variant SKU"]
      text += "<tr>";
      for (let h in import_headers){
        text += "<th>" + import_headers[h] + "</th>";
      }
      text += "</tr>";
      for (let row in rows){
        console.log("row: ", row);
        text += "<tr>";
        for (let col in rows[row]){
          console.log("col: ", col);
          text += "<td>" + rows[row][col] + "</td>";
        }
        text += "</tr>";
        
        console.log("text", text);
      }
      import_table_preview.innerHTML = text;
      var table_caption = import_table_preview.createCaption();
      table_caption.innerHTML = "Product Import"

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

      //document.getElementById('import_json').innerHTML = JSON.stringify(rows);
      
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
            onChange={uploadToClient}
            multiple/> 
      <button
          className="btn btn-primary"
          type="submit"
          onClick={uploadToServer}
        >
          Generate Products
        </button>
      {/* <a href="Product-Import.xlsx" download>Download Product Import</a> */}
      <button onClick={xport}>Download Products</button>

      <div className="table_wrapper">
        <table id="import_table"></table>
      </div>

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