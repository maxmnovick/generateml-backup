# converter.py
# convert from one type to another, one unit to another, etc

def convert_all_weights_to_grams(all_init_weights, init_unit='lb'):
    all_weights_in_grams = [] # shopify requires grams
    #print("\n===Convert Weights to Grams===\n")
    for item_idx in range(len(all_init_weights)):
        #item_details = all_details[item_idx]
        #print("item_details: " + str(item_details))
        item_weight = all_init_weights[item_idx]
        #print("item_weight: " + item_weight)
        weight_in_grams = '' # rather be nothing than wrong
        if item_weight != '' and item_weight != 'n/a':
            if init_unit=='lb':
                weight_in_grams = str(float(item_weight) * 453.59237)
            else:
                print("WARNING: Invalid Unit \'" + init_unit + "\'!")
            

        all_weights_in_grams.append(weight_in_grams)

    return all_weights_in_grams