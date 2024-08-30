export interface Country {
  code: string
  name: string
  european: boolean
  transfer: boolean
}

export interface Region {
  label: string
  departments: GeoArea[]
}

export interface GeoArea {
  code: string
  label: string
}
