# for basic handling of api
import json
# import sys
# import logging

# for added fcns
import re
import copy # to store init deep copy of catalog for processing
import reader # format input field values
import converter # convert all weights to grams
import generator # generate output
import sorter # sort items by size
import writer # format output
import determiner # determine std key

#logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger()
# logger.setLevel(logging.INFO)

# order of detail fields, from init catalog
sku_idx = 0
handle_idx = 1
title_idx = 2
intro_idx = 3
color_idx = 4
mat_idx = 5
finish_idx = 6
width_idx = 7
depth_idx = 8
height_idx = 9
weight_idx = 10
features_idx = 11
cost_idx = 12
img_src_idx = 13
barcode_idx = 14

# set the seller for different cost to price conversions and other requirements such as if inventory tracking capable
seller = 'HFF' # examples: JF, HFF

vendor = "acme"

# def generate_catalog(vendor_product_data):
#     print("vendor_product_data: " + str(vendor_product_data))

# convert from ['1;2;3','4,5,6']
# to [{'1':'1','2':'2','3':'3'},{'1':'4','2':'5','3':'6'}]
def convert_all_final_item_info_to_json(all_info):
	print("\n===Convert All Final Item Info to JSON===\n")
	print("all_info: " + str(all_info))
	all_json = []

	# Handle;Title;Body (HTML);Vendor;Standardized Product Type;Custom Product Type;Tags;Published;Option1 Name;Option1 Value;Option2 Name;Option2 Value;Option3 Name;Option3 Value;Variant SKU;Variant Grams;Variant Inventory Tracker;Variant Inventory Qty;Variant Inventory Policy;Variant Fulfillment Service;Variant Price;Variant Compare At Price;Variant Requires Shipping;Variant Taxable;Variant Barcode;Image Src;Image Position;Image Alt Text;Variant Image;Variant Weight Unit;Variant Tax Code;Cost per item;Status
	# ['handle','title','body_html','vendor','standard_product_type','product_type','product_tags','published','option1_name', 'option1_value', 'option2_name', 'option2_value', 'option3_name', 'option3_value', 'sku','item_weight_in_grams','vrnt_inv_tracker','vrnt_inv_qty','vrnt_inv_policy','vrnt_fulfill_service','vrnt_price','vrnt_compare_price','vrnt_req_ship','vrnt_taxable','barcode','product_img_src','img_position','img_alt','vrnt_img','vrnt_weight_unit','vrnt_tax_code','item_cost','product_status']
	desired_import_fields = ['handle','title','body_html','vendor','standard_product_type','product_type','product_tags','published','option1_name', 'option1_value', 'option2_name', 'option2_value', 'option3_name', 'option3_value', 'sku','item_weight_in_grams','vrnt_inv_tracker','vrnt_inv_qty','vrnt_inv_policy','vrnt_fulfill_service','vrnt_price','vrnt_compare_price','vrnt_req_ship','vrnt_taxable','barcode','product_img_src','img_position','img_alt','vrnt_img','vrnt_weight_unit','vrnt_tax_code','item_cost','product_status']
	num_fields = len(desired_import_fields)
	print("num_fields in desired_import_fields: " + str(num_fields))

	for item_info in all_info:
		print("item_info: " + str(item_info))
		# 1;2;3
		item_info_list = item_info.split(';') # this always comes in standard format corresponding to desired import fields
		print("item_info_list: " + str(item_info_list))
		num_features = len(item_info_list)
		print("num_features in item_info_list: " + str(num_features))
		item_json = {}
		for field_idx in range(len(desired_import_fields)):
			field = desired_import_fields[field_idx]
			print("field: " + str(field))
			value = item_info_list[field_idx]
			print("value: " + str(value))
			# handle
			item_json[field] = value

		all_json.append(item_json)

	print("all_json: " + str(all_json))

	return all_json

# def determine_standard_key(raw_key):
#     print("\n===Determine Standard Key for " + raw_key + "===\n")

#     standard_key = ''

#     all_field_keywords = { 
#         'sku':['sku','item#'], 
#         'collection':['collection'],
#         'features':['features','acme.description'],
#         'type':['product type','description'],
#         'intro':['intro','short description'],
#         'color':['color'],
#         'material':['material'],
#         'finish':['finish'],
#         'width':['width'],
#         'depth':['depth','length'],
#         'height':['height'],
#         'weight':['weight'],
#         'cost':['cost','price'],
#         'images':['image'],
#         'barcode':['barcode']
#     }

#     for field_key, field_keywords in all_field_keywords.items():
#         print("field_key, field_keywords: " + field_key + ", " + str(field_keywords))
#         for keyword in field_keywords:
#             raw_key_no_space = re.sub('(\\s+|_)','',raw_key.lower()) # unpredictable typos OR format in headers given by vendor such as 'D E S C R I P T I O N'
#             keyword_no_space = re.sub('\\s', '', keyword)
#             if re.search(keyword_no_space, raw_key_no_space):
#                 print("keyword " + keyword + " in raw_key " + raw_key)
#                 standard_key = field_key
#                 break
#         if standard_key != '':
#             break

#     print("standard_key: " + standard_key)
#     return standard_key

# def format_vendor_product_data(raw_data, key):
# 	print("\n===Format Vendor Product Data===\n")
# 	print("raw_data: " + str(raw_data))

# 	data = str(raw_data) # should it be blank init so we can check it has been set easily?

# 	text_fields = ['type','features','intro','finish','material'] # plain text is interpreted specifically
# 	if key == 'sku':
# 		data = str(raw_data).strip().lstrip("0")
# 	elif key == 'cost':
# 		data = str(raw_data).replace("$","").replace(",","").strip()
# 	elif key == 'images':
# 		data = str(raw_data).strip().lstrip("[").rstrip("]")
# 	elif key in text_fields:
# 		data = str(raw_data).strip().replace(";","-")
# 	else:
# 		data = str(raw_data).strip()
# 	print("data: " + key + " " + str(data))

# 	return data

# convert from all_items_json = [[{'sku':'sku1','collection':'col1'}]]
# to [{'sku':['sku1'],'collection':['col1']}]
def convert_list_of_items_to_fields(all_items_json):

	list_of_fields = []
	all_fields_dict = {}
	
	for sheet in all_items_json:
		print("sheet: " + str(sheet))
		# all_skus = []
		# all_collections = []
		# all_values = []
		for item_json in sheet:
			print("item_json: " + str(item_json))
			# all_skus.append(item_json['sku'])
			# all_collections.append(item_json['collection'])
			for key in item_json:
				standard_key = determiner.determine_standard_key(key)
				formatted_input = reader.format_vendor_product_data(item_json[key], standard_key) # passing in a single value corresponding to key. also need key to determine format.
				if standard_key != '' and formatted_input != '':
					if key in all_fields_dict.keys():
						print("add to existing key")
						all_fields_dict[standard_key].append(formatted_input)
					else:
						print("add new key")
						all_fields_dict[standard_key] = [formatted_input]
		# all_fields_dict['sku'] = all_skus
		# all_fields_dict['collection'] = all_collections
		print("all_fields_dict: " + str(all_fields_dict))
			
		list_of_fields.append(all_fields_dict)

	print("list_of_fields: " + str(list_of_fields))
	return list_of_fields


def generate_catalog_from_json(all_items_json):
	print("\n===Auto Generate Catalog Given JSON===\n")
	print("all_items_json: " + str(all_items_json))

	catalog = []

	ext = 'tsv'

	# header names given by vendor, rather than determining index

	#catalog_dict = {} # store lists based on desired field name key
	desired_field_names = ['sku', 'collection', 'type', 'intro', 'color', 'material', 'finish', 'width', 'depth', 'height', 'weight', 'features', 'cost', 'images', 'barcode'] #corresponding to keys in dict. determine by type of generator. bc this is product generator we are look for product fields to form catalog, before it is converted to import
	crucial_field_names = ['sku', 'cost', 'images'] # , cost, images]
	current_sheet_field_name = '' # loop thru each sheet and each field in each sheet

	# for unknown no. sheets with unknown contents
	# for user input, we have their list of files to loop thru

	all_sheet_all_field_values = convert_list_of_items_to_fields(all_items_json)
	# format keys and values before sending to display
	# all_sheet_all_field_values = determiner.determine_standard_keys(all_sheet_all_field_values)
	# all_sheet_all_field_values = format

	print("\n === Display Catalog Info === \n")

	catalog = []

	# take first sheet and loop thru following sheets to see if matching sku entry
	sheet1 = all_sheet_all_field_values[0]
	print("sheet1: " + str(sheet1))
	# all keys
	# sku_key = 'sku'
	# # all fields/values
	# all_sheet1_skus = []
	# if sku_key in sheet1.keys():
	# 	all_sheet1_skus = sheet1[sku_key]
	# print("all_sheet1_skus init: " + str(all_sheet1_skus))
	# all_sheet1_collections = []
	#all_sheet1_prices = sheet1['prices']
	all_sheet1_values = {}
	for key in desired_field_names:
		if key in sheet1.keys():
		#if sheet1[key] != '':
			all_sheet1_values[key] = sheet1[key]
	print("all_sheet1_values init: " + str(all_sheet1_values))

	# see if all fields given by seeing if left blank or key exists?
	all_fields_given = True
	print("sheet1.keys(): " + str(sheet1.keys()))
	for key in desired_field_names:
		
		if key not in sheet1.keys():
		#if sheet1[key] == '':
			all_fields_given = False
			break
	print("all_fields_given in first sheet? " + str(all_fields_given)) # since we assume all sheets rely on each other for full info this does not happen until we upgrade to allowing sheets with full and partial info

	all_sheet1_skus = all_sheet1_values['sku']
	for product_idx in range(len(all_sheet1_skus)):
		sheet1_all_field_values = {}
		for key in all_sheet1_values:
			print("key in all_sheet1_values: " + str(key))
			sheet1_value = all_sheet1_values[key][product_idx]
			print("sheet1_value: " + str(sheet1_value))
			sheet1_all_field_values[key] = sheet1_value
		sheet1_sku = all_sheet1_skus[product_idx]
		# sheet1_collection = ''
		# if len(all_sheet1_collections) > 0:
		# 	sheet1_collection = all_sheet1_collections[product_idx]
		# #sheet1_cost = all_sheet1_prices[product_idx]
		# sheet_all_field_values = [sheet1_sku] # corresponding to desired field names
		print("sheet1_all_field_values: " + str(sheet1_all_field_values))

		# init blank and then we will check if spots blank to see if we should transfer data
		product_catalog_dict = {
			'sku':'n/a',
			'collection':'n/a',
			'type':'n/a',
			'intro':'n/a',
			'color':'n/a',
			'material':'n/a',
			'finish':'n/a',
			'width':'n/a',
			'depth':'n/a',
			'height':'n/a',
			'weight':'n/a',
			'features':'n/a',
			'cost':'n/a',
			'images':'n/a',
			'barcode':'n/a'
		}

		for key in desired_field_names:
			if key in sheet1.keys():
			#if sheet1[key] != '':
				current_sheet_value = sheet1[key][product_idx]
				print("current_sheet_" + key + ": " + str(current_sheet_value))
				if current_sheet_value != '' and current_sheet_value != 'n/a':
					product_catalog_dict[key] = current_sheet_value
		print("product_catalog_dict after sheet1: " + str(product_catalog_dict))

		if all_fields_given:
			for field_idx in range(len(desired_field_names)):
				desired_field_name = desired_field_names[field_idx]
				sheet_field_value = sheet1_all_field_values[desired_field_name]
				if sheet_field_value != '' and sheet_field_value != 'n/a':
					product_catalog_dict[desired_field_name] = sheet_field_value
			


		# compare all subsequent sheets to first sheet
		elif len(all_sheet_all_field_values) > 1 and not all_fields_given: # if we have more than 1 sheet and we need more fields. 
			for current_sheet_idx in range(1,len(all_sheet_all_field_values)):
				
				current_sheet = all_sheet_all_field_values[current_sheet_idx] # current sheet
				print("current_sheet: " + str(current_sheet))
				# current_sheet_dict = {}
				# for key in desired_field_names:
				# 	if key in current_sheet_all_field_values.keys():
				# 		all_current_sheet_current_field_values = current_sheet_all_field_values[key]
				# 		current_sheet_dict[key] = all_current_sheet_current_field_values
				
				#for key in desired_field_names:
					#if key in current_sheet_all_field_values.keys():
				all_current_sheet_skus = current_sheet['sku']
				
				#all_current_sheet_collections = current_sheet_all_field_values['collections']
				#all_current_sheet_prices = current_sheet_all_field_values['price']
		

				#match_in_sheet = False
				for current_sheet_item_idx in range(len(all_current_sheet_skus)):
					
					sheet1_sku = sheet1_all_field_values['sku']
					current_sheet_sku = all_current_sheet_skus[current_sheet_item_idx]
					#current_sheet_collection = all_current_sheet_collections[current_sheet_item_idx]
					
					if sheet1_sku == current_sheet_sku:
						print("sheet1_sku matches current_sheet_sku: " + sheet1_sku + ", " + current_sheet_sku)
						#match_in_sheet = True

						for key in desired_field_names:
							if key in current_sheet.keys():
							#if current_sheet[key] != '':
								current_sheet_value = current_sheet[key][current_sheet_item_idx]
								print("current_sheet_" + key + ": " + str(current_sheet_value))
								if current_sheet_value != '' and current_sheet_value != 'n/a':
									product_catalog_dict[key] = current_sheet_value
						# product_catalog_dict['sku'] = sheet1_sku
						# product_catalog_dict['collection'] = current_sheet_collection
						# product_catalog_dict['type'] = current_sheet_type

						#all_current_sheet_images = []
						# key = 'images'
						# if key in current_sheet_all_field_values.keys():
						# 	all_current_sheet_images = current_sheet_all_field_values[key]
						# 	current_sheet_values = all_current_sheet_images[current_sheet_item_idx]
						# 	if current_sheet_values != '' and current_sheet_values != 'n/a':
						# 		product_catalog_dict[key] = current_sheet_values

						break

		print("product_catalog_dict: " + str(product_catalog_dict))


		# see if crucial fields given by seeing if left blank or key exists?
		crucial_fields_given = True
		for crucial_field in crucial_field_names:
			#print("product_catalog_dict.keys(): " + str(product_catalog_dict.keys()))
			#if crucial_field not in product_catalog_dict.keys():
			if product_catalog_dict[crucial_field] == '':
				crucial_fields_given = False
				break

		if crucial_fields_given: 
			catalog_info = list(product_catalog_dict.values()) #[sheet1_sku] #, coll_name, product_type, intro, color, material, finish, length, width, height, weight, features, sheet1_cost, img_links, barcode]
			print("catalog_info: " + str(catalog_info))
			catalog.append(catalog_info)
		else:
			print("Warning: Missing fields for SKU " + sheet1_sku + ", so product not uploaded!")


	return catalog






# print as single string that can then be separated by semicolon delimiter
def display_shopify_variants(seller, vendor, all_details, product_titles, all_costs, all_barcodes, product_handles, product_tags, product_types, product_img_srcs, product_options, product_descrip_dict, all_skus, all_weights, all_weights_in_grams, import_tool = 'shopify'): # set import tool when calling to display the variants to be imported with the given import tool, bc they have different import orders although some do not care about order but use the title to determine field value match

	print("\n === Display Shopify Variants === \n")

	all_final_item_info = []

	for item_idx in range(len(product_titles)):

		# fields copied from details to shopify import
		#handle = all_handles[item_idx] formerly copied directly from catalog table but now made automatically from raw data descrip and collection name (if col name not given by vendor then look in product names table)
		item_cost = all_costs[item_idx]
		barcode = all_barcodes[item_idx]
		#img_src = all_img_srcs[item_idx] # formerly copied from catalog but img src may need to be reformatted as with google drive

		# fields generated specifically for shopify import
		product_handle = product_handles[item_idx] # added new way to make product handle 8/21/22
		product_title = product_titles[item_idx]
		product_tag_string = product_tags[item_idx]
		product_type = product_types[item_idx]
		product_img_src = product_img_srcs[item_idx]

		product_option_string = writer.format_option_string(product_options[item_idx])

		#body_html = product_descriptions[item_idx]
		body_html = product_descrip_dict[product_handle]
		vrnt_inv_tracker = '' # leave blank unless inv track capable
		vrnt_inv_policy = ''
		if import_tool == 'excelify':
			vrnt_inv_policy = 'continue'
		else:
			vrnt_inv_policy = 'deny'
		vrnt_weight_unit = 'lb'
		cmd = 'UPDATE'
		#vrnt_price = compute_vrnt_price(item_cost, product_type)
		vrnt_price = generator.generate_vrnt_price(item_cost, product_type, seller) # seller tells us desired multiplier
		#vrnt_compare_price = compute_vrnt_compare_price(vrnt_price)
		vrnt_compare_price = generator.generate_vrnt_compare_price(vrnt_price)

		# fields determined by request content/context
		published = 'TRUE'
		published_scope = 'global'

		# general fields
		sku = all_skus[item_idx]
		item_weight = all_weights[item_idx]

		final_item_info = ""
		if import_tool == 'shopify':
			# shopify specific fields
			standard_product_type = ''
			item_weight_in_grams = all_weights_in_grams[item_idx]
			vrnt_inv_qty = ''
			vrnt_fulfill_service = 'manual'
			vrnt_req_ship = 'TRUE'
			vrnt_taxable = 'TRUE'
			img_position = ''
			img_alt = ''
			gift_card = 'FALSE'
			vrnt_tax_code = ''
			product_status = 'active'

			#print("product_type: " + product_type)

			vrnt_img = '' # still need to account for multiple img srcs given

			# each image needs a new row, but deal with that after sorted by size bc that function needs to isolate products and sort indices
			# product_imgs = product_img_src.split(",")
			# #print("product_imgs: " + str(product_imgs))
			# if len(product_imgs) > 0:
			# 	for img in product_imgs:
			# 		#print("img: " + str(img))
			# 		final_item_info = product_handle + ";" + product_title + ";" + body_html + ";" + vendor.title() + ";" + standard_product_type + ";" + product_type + ";" + product_tag_string + ";" + published + ";" + product_option_string + ";" + sku + ";" + item_weight_in_grams + ";" + vrnt_inv_tracker + ";" + vrnt_inv_qty + ";" + vrnt_inv_policy + ";" + vrnt_fulfill_service + ";" + vrnt_price + ";" + vrnt_compare_price + ";" + vrnt_req_ship + ";" + vrnt_taxable + ";" + barcode + ";" + img + ";" + img_position + ";" + img_alt + ";" + vrnt_img + ";" + vrnt_weight_unit + ";" + vrnt_tax_code + ";" + item_cost + ";" + product_status
			# 		#print(final_item_info)
			# 		all_final_item_info.append(final_item_info)
			# else:
			# 	final_item_info = product_handle + ";" + product_title + ";" + body_html + ";" + vendor.title() + ";" + standard_product_type + ";" + product_type + ";" + product_tag_string + ";" + published + ";" + product_option_string + ";" + sku + ";" + item_weight_in_grams + ";" + vrnt_inv_tracker + ";" + vrnt_inv_qty + ";" + vrnt_inv_policy + ";" + vrnt_fulfill_service + ";" + vrnt_price + ";" + vrnt_compare_price + ";" + vrnt_req_ship + ";" + vrnt_taxable + ";" + barcode + ";" + product_img_src + ";" + img_position + ";" + img_alt + ";" + vrnt_img + ";" + vrnt_weight_unit + ";" + vrnt_tax_code + ";" + item_cost + ";" + product_status
			# 	#print(final_item_info)
			# 	all_final_item_info.append(final_item_info)

			final_item_info = product_handle + ";" + product_title + ";" + body_html + ";" + vendor.title() + ";" + standard_product_type + ";" + product_type + ";" + product_tag_string + ";" + published + ";" + product_option_string + ";" + sku + ";" + item_weight_in_grams + ";" + vrnt_inv_tracker + ";" + vrnt_inv_qty + ";" + vrnt_inv_policy + ";" + vrnt_fulfill_service + ";" + vrnt_price + ";" + vrnt_compare_price + ";" + vrnt_req_ship + ";" + vrnt_taxable + ";" + barcode + ";" + product_img_src + ";" + img_position + ";" + img_alt + ";" + vrnt_img + ";" + vrnt_weight_unit + ";" + vrnt_tax_code + ";" + item_cost + ";" + product_status
			#print(final_item_info)
			all_final_item_info.append(final_item_info)
		elif import_tool == 'excelify':
			final_item_info = sku + ";" + product_handle + ";" + item_weight + ";" + item_cost + ";" + barcode + ";=" + body_html + ";" + product_option_string + ";" + product_tag_string + ";" + product_img_src + ";" + product_type + ";" + product_title + ";" + published + ";" + published_scope + ";" + vrnt_inv_tracker + ";" + vrnt_inv_policy + ";" + vrnt_weight_unit + ";" + cmd + ";" + vendor + ";" + vrnt_price + ";" + vrnt_compare_price

			#print(final_item_info)
			all_final_item_info.append(final_item_info)

	#print("\n===ALL FINAL ITEM INFO===\n" + str(all_final_item_info))

	#sorted_final_item_info = sort_items_by_size(all_final_item_info, "shopify") # we do not want to remove lines with same handles if they have different images
	sorted_final_item_info = sorter.sort_items_by_size(all_final_item_info, "shopify", all_details) # we do not want to remove lines with same handles if they have different images
	#sorted_final_item_info = all_final_item_info

	# shopify import tool needs imgs on different lines
	if import_tool == 'shopify':
		sorted_final_item_info = sorter.split_variants_by_img(sorted_final_item_info)

	writer.display_shopify_variant_headers()
	for item_info in sorted_final_item_info:
		print(item_info)

	return sorted_final_item_info

# adapted from product generator
def generate_all_products(all_items_json):
	print("\n===Generate All Products===\n")

	seller = 'HFF'
	vendor = 'acme'

	print("input all_items_json: " + str(all_items_json))
	all_details = generate_catalog_from_json(all_items_json) # catalog here corresponds to all_details in original product generator
	print("catalog: " + str(all_details))

	# generate product
	print("\n===Generate Product===\n")
	# store init item details untouched so we can detect measurement type based on input format of dimensions
	init_all_details = copy.deepcopy(all_details)

	# General Info from Details table
	all_skus = reader.format_field_values('sku', all_details)
	all_widths = reader.format_field_values('width', all_details, init_all_details)
	all_depths = reader.format_field_values('depth', all_details, init_all_details)
	all_heights = reader.format_field_values('height', all_details, init_all_details)
	all_weights = reader.format_field_values('weight', all_details, init_all_details)
	init_unit='lb'
	all_weights_in_grams = converter.convert_all_weights_to_grams(all_weights, init_unit) # shopify requires grams
	all_costs = reader.format_field_values('cost', all_details)
	all_barcodes = reader.format_field_values('barcode', all_details)
	all_img_srcs = reader.format_field_values('img', all_details)
	all_vrnt_imgs = reader.format_field_values('vrnt_img', all_details)


	# ====== Shopify Product Catalog ======
	print("\n====== Shopify Product Catalog ======\n")

	#writer.display_all_item_details(init_all_details)

	# generate handles
	product_handles = generator.generate_all_handles(all_details) # formerly copied directly from catalog table but now made automatically from raw data descrip and collection name (if col name not given by vendor then look in product names table)
	#writer.display_field_values(product_handles)

	# generate titles, based on handles
	product_titles = generator.generate_all_titles(all_details, product_handles)
	#writer.display_field_values(product_titles)

	# generate tags
	product_tags = generator.generate_all_tags(all_details, vendor)
	#writer.display_field_values(product_tags)

	# generate product types
	product_types = generator.generate_all_product_types(all_details)
	#writer.display_field_values(product_types)

	# generate product img srcs
	product_img_srcs = generator.generate_all_product_img_srcs(all_details)
	#writer.display_field_values(product_img_srcs)

	# generate options
	product_options = generator.generate_all_options(all_details, init_all_details) # we need init details to detect measurement type
	#writer.display_field_values(product_options)
	#writer.display_all_item_details(init_all_details)

	# generate descriptions by list of instances
	#product_descriptions = generator.generate_all_descriptions(all_details, init_all_details)
	#writer.display_field_values(product_descriptions)
	# generate descriptions with dictionary
	product_descrip_dict = generator.generate_descrip_dict(all_details, init_all_details)
	#writer.display_field_values(product_descrip_dict)




	# convert final item info to product import rows [{}]
	
	#all_info_sample = ['handle;title;variant_sku;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;22;23;24;25;26;27;28;29;30;31;32;33']
	all_final_item_info = display_shopify_variants(seller, vendor, all_details, product_titles, all_costs, all_barcodes, product_handles, product_tags, product_types, product_img_srcs, product_options, product_descrip_dict, all_skus, all_weights, all_weights_in_grams, import_tool = 'shopify')
	all_products = convert_all_final_item_info_to_json(all_final_item_info) #[{'sku':'sku1'}] all final item json
	print("all_products: " + str(all_products))

	return all_products

def generate_single_product():
	product = {}
	return product

def handler(event, context):
	print('received event:')
	print(event)
	# logger.info('event')
    # logger.info(event)
	# # queryStringParameters = { param1: x, param2: y }
	submit_type = event.get('queryStringParameters')['submit_type']
	final_data = json.dumps('')
	if submit_type == 'form':
		sku = event.get('queryStringParameters')['sku']
		collection = event.get('queryStringParameters')['collection']
		type = event.get('queryStringParameters')['type']
		intro = event.get('queryStringParameters')['intro']
		colors = event.get('queryStringParameters')['colors']
		materials = event.get('queryStringParameters')['materials']
		finish = event.get('queryStringParameters')['finish']
		width = event.get('queryStringParameters')['width']
		depth = event.get('queryStringParameters')['depth']
		height = event.get('queryStringParameters')['height']
		weight = event.get('queryStringParameters')['weight']
		features = event.get('queryStringParameters')['features']
		cost = event.get('queryStringParameters')['cost']
		images = event.get('queryStringParameters')['images']
		
		all_items_json = [[{
			"sku":sku,
			"collection":collection,
			"type":type,
			"intro":intro,
			"colors":colors,
			"materials":materials,
			"finish":finish,
			"width":width,
			"depth":depth,
			"height":height,
			"weight":weight,
			"features":features,
			"cost":cost,
			"images":images
		}]]

		product = generate_all_products(all_items_json)[0]
		final_data = json.dumps(product)
	elif submit_type == 'file':
		all_items_json = json.loads(event.get('queryStringParameters')['vendor_product_json'])
		print("all_items_json: " + str(all_items_json))
		product_import_rows = generate_all_products(all_items_json)



        # sample test of generate product
        # for rows in all_items_json:
            
        #     product_import_rows = []
        #     import_row = {}

        #     # find key names
        #     # sku, collection, type
        #     row = rows[0] # any row to get the keys
        #     sku_key = 'sku'
        #     col_key = 'collection'
        #     type_key = 'type'
        #     for key in row:
        #         if re.search('Item#', key):
        #             sku_key = key
        #             print("sku_key: " + sku_key)
        #         elif re.search('Collection', key):
        #             col_key = key
        #             print("col_key: " + col_key)
        #         elif re.search('D E S C R I P T I O N', key):
        #             type_key = key
        #             print("type_key: " + type_key)

        #     for row in rows:
        #         print(row)
        #         # from user input
        #         # find sku key

        #         sku = collection = type = ''
        #         if sku_key in row.keys():
        #             sku = row[sku_key]
        #         print("sku: " + sku)
        #         if col_key in row.keys():
        #             collection = row[col_key]
        #         print("collection: " + collection)
        #         if type_key in row.keys():
        #             type = row[type_key]
        #         print("type: " + type)


        #         # generate variables
        #         handle = collection + '-' + type
        #         title = collection + ' ' + type
        #         variant_sku = sku
        #         #import_row = [handle, title, variant_sku]
        #         # OR
        #         import_row['handle'] = handle
        #         import_row['title'] = title
        #         import_row['variant_sku'] = variant_sku
        #         product_import_rows.append(import_row) # [{}]
		final_data = json.dumps(product_import_rows) # rows, one for each product, ready for import
	
	return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': final_data
    }