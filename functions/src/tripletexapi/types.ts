export interface TripletexEmployee {
  id: number
  dateOfBirth: string
  name: string;
}

export interface BaseTripletexResponse {
  from: number
  to: number
  versionDigest: string
  values: any[]
}

export interface BaseTripletexErrorResponse {
  status: number
  code: number
  message: string
  developerMessage: string | null
  validationMessages: any[] | null
  requestId: null
}