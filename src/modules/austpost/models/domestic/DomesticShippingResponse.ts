export interface DomesticShippingResponse {
    postage_result: PostageResult
}

export interface PostageResult {
    service: string
    delivery_time: string
    total_cost: string
    costs: Costs
}

export interface Costs {
    cost: Cost
}

export interface Cost {
    item: string
    cost: string
}
