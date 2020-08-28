export interface TripletexEmployee {
  id: number
  dateOfBirth: string
  firstName: string;
  lastName: string;
}

export interface BaseTripletexResponse {
  from: number
  to: number
  versionDigest: string
  values?: any[]
  value?: any
}

export interface BaseTripletexErrorResponse {
  status: number
  code: number
  message: string
  developerMessage: string | null
  validationMessages: any[] | null
  requestId: null
}

export interface TripletexResponse {
  data: BaseTripletexResponse,
  status: number
}
