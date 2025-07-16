export interface InternationalShippingResponse {
    postage_result: PostageResult
}

export interface PostageResult {
    service: string
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
