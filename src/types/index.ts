export type AcademicWork = {
    title: string
    publication_year: number
    cited_by_count: number
    authorships: { author: { display_name: string } }[]
  }

  export type QueryParams = {
    per_page: number
    page?: number
    filter?: string
    sort?: string
  }