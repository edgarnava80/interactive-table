import { type ColumnDef } from "@tanstack/react-table"
import type { AcademicWork } from "@/types"
import InteractiveTable from "@/components/InteractiveTable"
import { useEffect, useState } from "react"

function App() {
  const [data, setData] = useState<AcademicWork[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // const query = "https://api.openalex.org/works?filter=cited_by_count:100&per_page=100"
      const query = "https://api.openalex.org/works?per_page=100"
      try {
        const response = await fetch(query)
        const jsonData = await response.json()
        setData(jsonData.results)
        console.log(jsonData.results)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
      cell: (info) => info.getValue(),
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
    <div className="flex flex-col items-center justify-center min-h-svh">
      <InteractiveTable data={data} columns={columns} />
    </div>
  )
}

export default App
