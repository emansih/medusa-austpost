export interface DomesticServiceResponse {
  services: Services
}

export interface Services {
  service: Service[]
}

export interface Service {
  code: string
  name: string
  price: string
  max_extra_cover: number
  options: Options
}

export interface Options {
  option: Option[]
}

export interface Option {
  code: string
  name: string
  suboptions?: Suboptions
}

export interface Suboptions {
  option: Option2
}

export interface Option2 {
  code: string
  name: string
}