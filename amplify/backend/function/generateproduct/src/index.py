# for basic handling of api
import json
# import sys
# import logging

# for added fcns
import re

#logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger()
# logger.setLevel(logging.INFO)

def generate_catalog(vendor_product_data):
    print("vendor_product_data: " + str(vendor_product_data))

def handler(event, context):
    print('received event:')
    print(event)
    # logger.info('event')
    # logger.info(event)


    # queryStringParameters = { param1: x, param2: y }
    submit_type = event.get('queryStringParameters')['submit_type']
    final_data = json.dumps('')

    # if submit_type == 'form fill':

    #     rows = event.get('queryStringParameters')['vendor_product_json']
    #     final_data = json.dumps(rows)
        
        # collection = event.get('queryStringParameters')['collection']
        # type = event.get('queryStringParameters')['type']
    
    
    
        # handle = collection + '-' + type



        # final_data = json.dumps(handle)  #json.dumps('Hello from your new Amplify Python lambda!')
    
    #elif submit_type == 'upload file':
        
    # rows = event.get('queryStringParameters')['vendor_product_json']
    # final_data = json.dumps(rows)


    if submit_type == 'form':
        collection = event.get('queryStringParameters')['collection']
        type = event.get('queryStringParameters')['type']
        handle = collection + '-' + type
        final_data = json.dumps(handle)  #json.dumps('Hello from your new Amplify Python lambda!')
    elif submit_type == 'file':
        rows = json.loads(event.get('queryStringParameters')['vendor_product_json'])
        col = event.get('queryStringParameters')['collection']
        product_import_rows = []
        import_row = {}

        # find key names
        # sku, collection, type
        row = rows[0] # any row to get the keys
        sku_key = 'sku'
        col_key = 'collection'
        type_key = 'type'
        for key in row:
            if re.search('Item#', key):
                sku_key = key
                print("sku_key: " + sku_key)
            elif re.search('Collection', key):
                col_key = key
                print("col_key: " + col_key)
            elif re.search('D E S C R I P T I O N', key):
                type_key = key
                print("type_key: " + type_key)

        for row in rows:
            print(row)
            # from user input
            # find sku key

            sku = row[sku_key]
            print("sku: " + sku)
            collection = row[col_key]
            print("collection: " + collection)
            type = row[type_key]
            print("type: " + type)
            # generate variables
            handle = collection + '-' + type
            title = collection + ' ' + type
            variant_sku = sku
            #import_row = [handle, title, variant_sku]
            # OR
            import_row['handle'] = handle
            import_row['title'] = title
            import_row['variant_sku'] = variant_sku
            product_import_rows.append(import_row)
        final_data = json.dumps(product_import_rows) # rows, one for each product, ready for import
        # collection = event.get('queryStringParameters')['collection']
        # type = event.get('queryStringParameters')['type']
        # handle = collection + '-' + type
        # final_data = json.dumps(handle)  #json.dumps('Hello from your new Amplify Python lambda!')


    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': final_data
    }