import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import { CalculatedShippingOptionPrice, CalculateShippingOptionPriceDTO, CartLineItemDTO, CreateShippingOptionDTO, FulfillmentOption } from "@medusajs/framework/types"
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
        const destinationCountry = context.shipping_address?.country_code
        const serviceCodeId = (optionData as { id: string }).id;
        const packageWeight = context.items.reduce((sum, item) => {
            // @ts-ignore
            return sum + (item.variant.weight || 0)
        }, 0)

        let totalShippingPrice: number | null = null
        if(fromPostCode && toPostCode && destinationCountry == "au"){
            totalShippingPrice = await this.calculateDomesticPrice(toPostCode, fromPostCode, serviceCodeId, packageWeight, context.items)
        }

        if (destinationCountry && destinationCountry != "au"){
            const internationPrice = await this.client.calculateInternationalShipping({
                countryCode: destinationCountry,
                weight: packageWeight,
                serviceCode: serviceCodeId
            })
            totalShippingPrice = Number(internationPrice)
        }

        if (totalShippingPrice == null){
            throw new Error("Unable to get shipping price from Australia Post. Make sure your warehouse has a postcode and country code.")
        }

        return {
            calculated_amount: totalShippingPrice,
            is_calculated_price_tax_inclusive: true,
        }
    }

    private async calculateDomesticPrice(toPostCode: string, fromPostCode: string, serviceCodeId: string, packageWeight: number, items: CartLineItemDTO[]){
        const packageHeight = items.reduce((sum, item) => {
            // @ts-ignore
            return sum + (item.variant.height || 0)
        }, 0)

        const packageLength = items.reduce((sum, item) => {
            // @ts-ignore
            return sum + (item.variant.length || 0)
        }, 0)

        const packageWidth = items.reduce((sum, item) => {
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
        return Number(totalCost)
    }

    async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
        const fulfillmentOptions: FulfillmentOption[] = []

        fulfillmentOptions.push({
            id: "AUS_PARCEL_REGULAR",
            name: "(Domestic) Parcel Post",
            fulfillmentType: "domestic"
        })

        fulfillmentOptions.push({
            id: "AUS_PARCEL_EXPRESS",
            name: "(Domestic) Express Post",
            fulfillmentType: "domestic"
        })

        fulfillmentOptions.push({
            id: "INT_PARCEL_EXP_OWN_PACKAGING",
            name: "(International) Express Post",
            fulfillmentType: "international"
        })

        fulfillmentOptions.push({
            id: "INT_PARCEL_STD_OWN_PACKAGING",
            name: "(International) Standard Post",
            fulfillmentType: "international"
        })

        fulfillmentOptions.push({
            id: "INT_PARCEL_AIR_OWN_PACKAGING",
            name: "(International) Economy Air",
            fulfillmentType: "international"
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
