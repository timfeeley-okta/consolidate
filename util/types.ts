export interface AppsQuery {
  id: string
  name: string
  label: string
  status: string
  lastUpdated: Date
  created: Date
  features: any[]
  signOnMode: string
  _links: {
    uploadLogo: Link
    Links: Link[]
    profileEnrollment: Link
    policies: Link
    groups: Link
    logo: Link[]
    accessPolicy: Link
    users: Link
    deactivate: Link
  }
}
export interface RulesQuery {
  id: string
  status: string
  name: string
  priority: number
  created: Date
  lastUpdated: Date
  system: boolean
  conditions: null
  actions: ActionsType
  type: string
}

export interface ActionsType {
  appSignOn: any
}

export interface Link {
  name?: string
  href: string
  type?: string
}

export interface RulesAndApps {
  app: AppsQuery
  rules: ActionsType
  hash: string
}
export type GroupedResults = { [key: string]: RulesAndApps[] }
