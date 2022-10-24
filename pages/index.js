import { API, autoShowTooltip, DataStore } from "aws-amplify";
import React, { useState } from "react";
import { ProductDetails, ProductImport } from "../src/models";
import { CatalogHeaders, CatalogRows, ImportHeaders, ImportRows, ProductDetailsForm, ProductCard } from "../src/ui-components";
//const {spawn} = require("child_process");
import * as XLSX from 'xlsx';

export default function Home() {

  const [sku, setSku] = useState("");
  const [collection, setCollection] = useState("");
  const [type, setType] = useState("");
  const [intro, setIntro] = useState("");
  const [colors, setColors] = useState("");
  const [materials, setMaterials] = useState("");
  const [finish, setFinish] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [features, setFeatures] = useState("");
  const [cost, setCost] = useState("");
  const [images, setImages] = useState("");
  const [barcode, setBarcode] = useState("");

  const [handle, setHandle] = useState("");
  const [title, setTitle] = useState("");

  const [jsonRows, setJsonRows] = useState([{ text: 'Learn Hooks' }]);
  const [allItemJson, setAllItemJson] = useState([]);

  const [importRows, setImportRows] = useState([])

  //const [createImageURL, setCreateImageURL] = useState(null); // set sample preview image

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
  
  const previewProduct = async (product) => {
    console.log("product: ", product);
    // make product page preview for first sample
    var product_preview_header = document.getElementById("product_preview_header");
    product_preview_header.innerHTML = "Product Preview"

    const sample_title = product['title'];
    var product_title = document.getElementById("product_title");
    product_title.innerHTML = sample_title

    var product_details_wrapper = document.getElementById("product_details_wrapper");
    product_details_wrapper.style.border = "3px solid white";
    product_details_wrapper.style.padding = "6px 12px";

    const sample_img = product['product_img_src'];
    console.log("sample_img: ", sample_img)
    var product_img = document.getElementById("product_image");
    product_img.src = sample_img;
    product_img.style.maxWidth = '500px';
    // var product_card_img = document.getElementById("product_card_image");
    // product_card_img.src = sample_img;
    // product_card_img.style.maxWidth = '300px';

    const sample_price = product['vrnt_price'];
    const sample_compare_price = product['vrnt_compare_price'];
    var product_price = document.getElementById("product_price");
    product_price.innerHTML = "$" + sample_price + "   <span id=\"product_compare_price\">$" + sample_compare_price + "</span>"
    
    var product_compare_price = document.getElementById("product_compare_price");
    product_compare_price.style.textDecoration = "line-through"
    // product_compare_price.innerHTML = "   $" + sample_compare_price

    const sample_option1_name = product['option1_name'];
    console.log("sample_option1_name: ", sample_option1_name)
    if(sample_option1_name != ''){
      const sample_option1_value = product['option1_value'];
      var product_options = document.getElementById("product_options");
      product_options.innerHTML = sample_option1_name + ": " + "<span className=\"option_value\">" + sample_option1_value + "</span>"
    }
    const sample_descrip = product['body_html'];
    var product_descrip = document.getElementById("product_descrip");
    product_descrip.innerHTML = sample_descrip
  }

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
      const import_headers = ["Handle", "Title", "Body (HTML)", "Vendor", "Standardized Product Type", "Custom Product Type", "Tags", "Published", "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value", "Option3 Name","Option3 Value", "Variant SKU", "Variant Grams", "Variant Inventory Tracker", "Variant Inventory Qty", "Variant Inventory Policy", "Variant Fulfillment Service", "Variant Price", "Variant Compare At Price", "Variant Requires Shipping", "Variant Taxable", "Variant Barcode", "Image Src", "Image Position", "Image Alt Text", "Variant Image", "Variant Weight Unit", "Variant Tax Code", "Cost per item", "Status"] // equals display_shopify_variant_headers
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
          let data = rows[row][col]
          console.log("data: ", data);
          if (col == "body_html"){
            //replace html characters with codes
            data = data.replace(/</g,"&lt;").replace(/>/g,"&gt;")
            console.log("data after replacement: ", data);
          }
          text += "<td><div>" + data + "</div></td>";
        }
        text += "</tr>";
        
        console.log("text", text);
      }
      import_table_preview.innerHTML = text;
      var table_caption = import_table_preview.createCaption();
      table_caption.innerHTML = "Product Import";
      table_caption.style.textAlign = "left";

      // make product page preview for first sample
      const sample_row = rows[0];
      console.log("sample_row: ", sample_row);
      previewProduct(sample_row);
      // var product_preview_header = document.getElementById("product_preview_header");
      // product_preview_header.innerHTML = "Product Preview"

      // const sample_row = rows[0];
      // console.log("sample_row: ", sample_row);
      // const sample_title = sample_row['title'];
      // var product_title = document.getElementById("product_title");
      // product_title.innerHTML = sample_title

      // var product_details_wrapper = document.getElementById("product_details_wrapper");
      // product_details_wrapper.style.border = "3px solid white";
      // product_details_wrapper.style.padding = "6px 12px";

      // const sample_img = sample_row['product_img_src'];
      // console.log("sample_img: ", sample_img)
      // var product_img = document.getElementById("product_image");
      // product_img.src = sample_img;
      // product_img.style.maxWidth = '500px';
      // // var product_card_img = document.getElementById("product_card_image");
      // // product_card_img.src = sample_img;
      // // product_card_img.style.maxWidth = '300px';

      // const sample_price = sample_row['vrnt_price'];
      // const sample_compare_price = sample_row['vrnt_compare_price'];
      // var product_price = document.getElementById("product_price");
      // product_price.innerHTML = "$" + sample_price + "   <span id=\"product_compare_price\">$" + sample_compare_price + "</span>"
      
      // var product_compare_price = document.getElementById("product_compare_price");
      // product_compare_price.style.textDecoration = "line-through"
      // // product_compare_price.innerHTML = "   $" + sample_compare_price

      // const sample_option1_name = sample_row['option1_name'];
      // console.log("sample_option1_name: ", sample_option1_name)
      // if(sample_option1_name != ''){
      //   const sample_option1_value = sample_row['option1_value'];
      //   var product_options = document.getElementById("product_options");
      //   product_options.innerHTML = sample_option1_name + ": " + "<span className=\"option_value\">" + sample_option1_value + "</span>"
      // }
      // const sample_descrip = sample_row['body_html'];
      // var product_descrip = document.getElementById("product_descrip");
      // product_descrip.innerHTML = sample_descrip


      // setImportRows(data);

      //document.getElementById('import_json').innerHTML = JSON.stringify(rows);
      
      //console.log("Post saved successfully!");
    } catch(e) {
      console.log(e);
    }
  };



  // save manually/individually
  const saveProduct = async () => {
    try {
      const myInit = {
        queryStringParameters: {
          submit_type: 'form',
          sku: sku,
          collection: collection
        }
      };
      // get the output data ready for import
      // we know the indexes in standard format so we save their values
      // handle_idx = 0
      // const all_final_item_info = await API.get('productgeneratorapi','/product', myInit);
      // handle = all_final_item_info[handle_idx]
      const product = await API.get('productgeneratorapi','/product', myInit);
      //const handle = 'handle'
      console.log({ product });

      previewProduct(product);

      handle = product['handle']

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

  // save manually/individually
  const generateProduct = async () => {
    try {
      const myInit = {
        queryStringParameters: {
          submit_type: 'form',
          sku: sku,
          collection: collection,
          type: type,
          intro: intro,
          colors: colors,
          materials: materials,
          finish: finish,
          width: width,
          depth: depth,
          height: height,
          weight: weight,
          features: features,
          cost: cost,
          images: images
        }
      };
      // get the output data ready for import
      // we know the indexes in standard format so we save their values
      // handle_idx = 0
      // const all_final_item_info = await API.get('productgeneratorapi','/product', myInit);
      // handle = all_final_item_info[handle_idx]
      const product = await API.get('productgeneratorapi','/product', myInit);
      //const handle = 'handle'
      console.log({ product });

      previewProduct(product);
      
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

      XLSX.writeFile(import_workbook, "Product-Import.csv");
    
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

  // const productPreviewOverrides {
  //   "image": {
  //     src: test
  //   }
  // }

  return (
    <div className="App">
      <div className="body_wrapper">
        <h1>Product Generator</h1>
        <h2>Generate a Product Page for an Ecommerce Website Automatically</h2>

        <h3>Generate Multiple Products Simultaneously</h3>
        <div className="step_wrapper">
          Step 1: <label htmlFor="product_data">Upload Product Data </label>
          <input type="file"
                id="product_data" name="product_data"
                accept=".xlsx,.xls,.tsv,.csv"
                onChange={uploadToClient}
                multiple/> 
        </div>
        
        <div className="step_wrapper">
          Step 2: <button
              className="btn btn-primary"
              type="submit"
              onClick={uploadToServer}
            >
              Generate Products
            </button>
        </div>

        <div className="step_wrapper">
          Step 3: <button onClick={xport}>Download Products</button>
        </div>

        
        <div className="table_wrapper">
          <table id="import_table"></table>
        </div>
        <h4 id="product_preview_header"></h4>
        <div id="product_details_wrapper" className="details_wrapper">
          <div id="product_title" className="title"></div>
          <img id="product_image"></img>
          <div id="product_price"><span id="product_compare_price" className="compare_price"></span></div>
          <div id="product_options"></div>
          <div id="product_descrip"></div>
        </div>

        {/* <ProductCard/> */}

        <h3>Generate a Single Product Individually</h3>
        <div className="form_wrapper">
          <label htmlFor="product_sku_field">SKU: </label>
          <input type="text" id="product_sku_field" onChange={(event) => {setSku(event.target.value);}}/>
          <label htmlFor="product_collection_field">Collection: </label>
          <input type="text" id="product_collection_field" onChange={(event) => {setCollection(event.target.value);}}/>
          <label htmlFor="product_type_field">Type: </label>
          <input type="text" id="product_type_field" onChange={(event) => {setType(event.target.value);}}/>
          <label htmlFor="product_intro_field">Intro: </label>
          <input type="text" id="product_intro_field" onChange={(event) => {setIntro(event.target.value);}}/>
          <label htmlFor="product_colors_field">Colors: </label>
          <input type="text" id="product_colors_field" onChange={(event) => {setColors(event.target.value);}}/>
          <label htmlFor="product_materials_field">Materials: </label>
          <input type="text" id="product_materials_field" onChange={(event) => {setMaterials(event.target.value);}}/>
          <label htmlFor="product_finish_field">Finish: </label>
          <input type="text" id="product_finish_field" onChange={(event) => {setFinish(event.target.value);}}/>
          <label htmlFor="product_width_field">Width: </label>
          <input type="text" id="product_width_field" onChange={(event) => {setWidth(event.target.value);}}/>
          <label htmlFor="product_depth_field">Depth: </label>
          <input type="text" id="product_depth_field" onChange={(event) => {setDepth(event.target.value);}}/>
          <label htmlFor="product_height_field">Height: </label>
          <input type="text" id="product_height_field" onChange={(event) => {setHeight(event.target.value);}}/>
          <label htmlFor="product_weight_field">Weight: </label>
          <input type="text" id="product_weight_field" onChange={(event) => {setWeight(event.target.value);}}/>
          <label htmlFor="product_features_field">Feature: </label>
          <input type="text" id="product_features_field" onChange={(event) => {setFeatures(event.target.value);}}/>
          <label htmlFor="product_cost_field">Cost: </label>
          <input type="text" id="product_cost_field" onChange={(event) => {setCost(event.target.value);}}/>
          <label htmlFor="product_images_field">Images: </label>
          <input type="text" id="product_images_field" onChange={(event) => {setImages(event.target.value);}}/>
          <label htmlFor="product_barcode_field">Barcode: </label>
          <input type="text" id="product_barcode_field" onChange={(event) => {setBarcode(event.target.value);}}/>
          
          <button onClick={generateProduct}>Generate Product</button>
        </div>


        {/* <ProductDetailsForm overrides={addProductOverrides}/>
        <div className="row">
          <div className="column">
            <CatalogHeaders />
            <CatalogRows />
          </div>
          <div className="column">
            <ImportHeaders />
            <ImportRows />
          </div>
        </div> */}
      </div>
      
    </div>
  );
}