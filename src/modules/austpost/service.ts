import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import { CalculatedShippingOptionPrice, CalculateShippingOptionPriceDTO, CreateShippingOptionDTO, FulfillmentOption } from "@medusajs/framework/types"
import Austpost from "./Austpost"

type Options = {
    apiKey: string
}


class AustPostFulfillmentProviderService extends AbstractFulfillmentProviderService {
    static identifier = "austpost-fulfillment"
    protected options_: Options
    protected client: Austpost

    constructor({ }, options: Options) {
        super()
        this.options_ = options
        this.client = new Austpost({ apiKey: options.apiKey })
    }

    async calculatePrice(
        optionData: CalculateShippingOptionPriceDTO["optionData"],
        data: CalculateShippingOptionPriceDTO["data"],
        context: CalculateShippingOptionPriceDTO["context"]
    ): Promise<CalculatedShippingOptionPrice> {
        const toPostCode = context.shipping_address?.postal_code
        const fromPostCode = context.from_location?.address?.postal_code
        // TODO: Support international shipping here        
        const serviceCodeId = (optionData as { id: string }).id;

        if(!toPostCode){
            throw Error("Destination postal code not found")
        }
        if(!fromPostCode){
            throw Error("Origin postal code not found")
        }

        const packageWeight = context.items.reduce((sum, item) => {
            // @ts-ignore
            return sum + (item.variant.weight || 0)
        }, 0)

        const packageHeight = context.items.reduce((sum, item) => {
            // @ts-ignore
            return sum + (item.variant.height || 0)
        }, 0)

        const packageLength = context.items.reduce((sum, item) => {
            // @ts-ignore
            return sum + (item.variant.length || 0)
        }, 0)

        const packageWidth = context.items.reduce((sum, item) => {
            // @ts-ignore
            return sum + (item.variant.width || 0)
        }, 0)

        
        const domesticShippingResponse = await this.client.calculateDomesticShipping({
            height: packageHeight,
            length: packageLength,
            weight: packageWeight,
            width: packageWidth,
            fromPostCode: fromPostCode,
            toPostCode: toPostCode,
            serviceCode: serviceCodeId
        })

        const totalCost = domesticShippingResponse.postage_result.total_cost
        
        return {
            calculated_amount: Number(totalCost),
            is_calculated_price_tax_inclusive: true,
        }
    }

    async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
        const fulfillmentOptions: FulfillmentOption[] = []
        // TODO: Add support for international shipping here        

        fulfillmentOptions.push({
            id: "AUS_PARCEL_REGULAR",
            name: "(Domestic) Parcel Post",
        })

        fulfillmentOptions.push({
            id: "AUS_PARCEL_EXPRESS",
            name: "(Domestic) Express Post",
        })
    

        return fulfillmentOptions
    }

    async canCalculate(data: CreateShippingOptionDTO): Promise<boolean> {
        return true
    }


    async validateFulfillmentData(optionData: Record<string, unknown>, data: Record<string, unknown>, context: Record<string, unknown>): Promise<any>{
        return {
            ...data
        }
    }
}

export default AustPostFulfillmentProviderService
