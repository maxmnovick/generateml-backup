import json

def generate_catalog(vendor_product_data):
    print("vendor_product_data: " + str(vendor_product_data))

def handler(event, context):
  print('received event:')
  print(event)

  # queryStringParameters = { param1: x, param2: y }
  collection = event.get('queryStringParameters')['collection']
  type = event.get('queryStringParameters')['type']
  handle = collection + '-' + type
  final_data = json.dumps(handle)  #json.dumps('Hello from your new Amplify Python lambda!')
  
  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': final_data
  }