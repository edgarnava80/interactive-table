import { type ColumnDef } from "@tanstack/react-table"
import type { AcademicWork, QueryParams } from "@/types"
import InteractiveTable from "@/components/InteractiveTable"
import { useEffect, useState, useCallback } from "react"
import axios from "axios"

const BASE_URL = "https://api.openalex.org/works"

function App() {
  const [data, setData] = useState<AcademicWork[]>([])
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState<QueryParams>({
    per_page: 100,
    page: 5,
    sort: "cited_by_count:desc",
  })

  const fetchData = useCallback(async (queryParams: QueryParams) => {
    try {
      const { data: responseData } = await axios.get(BASE_URL, {
        params: queryParams
      })
      return responseData
    } catch (error) {
      console.error("Error fetching data:", error)
      throw error
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        const responseData = await fetchData(params)
        setData(responseData.results)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params, fetchData])

  const columns: ColumnDef<AcademicWork>[] = [
    {
      accessorKey: "title",
      header: "📖 Título",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "publication_year",
      header: "📅 Año",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "cited_by_count",
      header: "🔢 Citaciones",
      cell: (info) => {
        const value = info.getValue() as number
        return value.toLocaleString()
      },
    },
    {
      id: "authors",
      header: "👥 Autores",
      cell: ({ row }) => {
        const rawAuthors = row?.original?.authorships.length > 2 ? row.original.authorships.slice(0, 2) : row.original.authorships
        const authors = rawAuthors.map((a) => a.author.display_name).join(", ")
        return <span>{authors}</span>
      },
    },
  ]

  if (loading) {
    return <div className="flex items-center justify-center min-h-svh">Loading...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh px-4">
      <InteractiveTable data={data} columns={columns} />
    </div>
  )
}

export default App
