
## MedusaJS x Australia Post

Fullfillment module for MedusaJS. This module displays the cost of delivery on checkout. 


# Setup

Get your API key from [Auspost](https://developers.auspost.com.au/apis). Add them to environment variable named `AUSTPOST_API_KEY`. 



# Admin Dashboard Setup

This was used as a reference: https://docs.medusajs.com/user-guide/settings/locations-and-shipping/locations

1. Enable "Austpost Fulfillment" as your fulfillment provider
![fulfillment_provider](docs/images/fulfillment_provider.png)

2. Go into edit location for your location. Ensure postal code is filled in. 

![edit_location](docs/images/edit_location.png)

3. Create the shipping options that will be shown to your users on checkout. 

![create_option](docs/images/create_option.png)


4. Enter the following fields to enable the fulfillment that you support

![fulfillment_details](docs/images/fulfillment_details.png)

Price type: Calculated
Name: Domestic Express Post(or whatever name you would like it to be to be shown to users)
Shipping profile: <Your shipping profile>
Fulfillment provider: Austpost Fulfillment
Fulfillment option: <Your choosen option>(Express / Parcel Post)


Repeat step 4 to add more fulfillment options for users. 

5. In product details page, add your products width, length, weight and height. The width, length and height needs to be in CM. Weight needs to be in KG. (Reference: https://developers.auspost.com.au/apis/pac/reference/postage-parcel-domestic-calculate)

Do this for all variants. 

![edit_variant](docs/images/edit_variant.png)