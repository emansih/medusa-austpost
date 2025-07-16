import { DomesticServiceResponse } from "./models/domestic/DomesticServiceResponse";
import { DomesticShippingResponse } from "./models/domestic/DomesticShippingResponse";
import { DomesticShipping } from "./models/domestic/DomesticShipping";
import { InternationalShipping } from "./models/domestic/InternationalShipping";
import { InternationalShippingResponse } from "./models/international/InternationalShippingResponse";

class Austpost {
    apiKey_: string;
    baseUrl: string;

    constructor({ apiKey }: { apiKey: string }) {
        this.apiKey_ = apiKey;
        this.baseUrl = "https://digitalapi.auspost.com.au";
    }

    private getHeaders_() {
        const headers = new Headers();
        headers.append("auth-key", this.apiKey_);
        return headers;
    }

    calculateDomesticShipping = async (shipping: DomesticShipping): Promise<DomesticShippingResponse> => {
        const path = `/postage/parcel/domestic/calculate.json?height=${shipping.height}&length=${shipping.length}&weight=${shipping.weight}&width=${shipping.width}&from_postcode=${shipping.fromPostCode}&to_postcode=${shipping.toPostCode}&service_code=${shipping.serviceCode}`;
        const url = `${this.baseUrl}${path}`;

        const response = await fetch(url, {
            method: "GET",
            headers: this.getHeaders_(),
        });

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
    
        const data = await response.json() as DomesticShippingResponse;
        return data;
    };

    calculateInternationalShipping = async (internationalShipping: InternationalShipping): Promise<InternationalShippingResponse> => {
        const path = `/postage/parcel/international/calculate.json?country_code=${internationalShipping.countryCode}&weight=${internationalShipping.weight}&service_code=${internationalShipping.serviceCode}`;
        const url = `${this.baseUrl}${path}`;

        const response = await fetch(url, {
            method: "GET",
            headers: this.getHeaders_(),
        });

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
        const data = await response.json() as InternationalShippingResponse
        return data
    }

    getDomesticShippingOptions = async (shipping: DomesticShipping): Promise<DomesticServiceResponse> => {
        const path = `/postage/parcel/domestic/service.json?height=${shipping.height}&length=${shipping.length}&weight=${shipping.weight}&width=${shipping.width}&from_postcode=${shipping.fromPostCode}&to_postcode=${shipping.toPostCode}`
        const url = `${this.baseUrl}${path}`;
        const response = await fetch(url, {
            method: "GET",
            headers: this.getHeaders_(),
        });

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
        const data = await response.json() as DomesticServiceResponse;

        return data
    }
}

export default Austpost;
