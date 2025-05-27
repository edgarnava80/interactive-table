import { type ColumnDef } from "@tanstack/react-table"
import type { AcademicWork, QueryParams } from "@/types"
import InteractiveTable from "@/components/InteractiveTable"
import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { type SortingState } from "@tanstack/react-table"

const BASE_URL = "https://api.openalex.org/works"

function App() {
  const [data, setData] = useState<AcademicWork[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [params, setParams] = useState<QueryParams>({
    per_page: 100,
    page: 1,
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

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      try {
        setLoading(true)
        const nextPage = (params.page || 1) + 1
        const responseData = await fetchData({ ...params, page: nextPage })
        const newResults = responseData.results
        
        setData(prev => [...prev, ...newResults])
        setParams(prev => ({ ...prev, page: nextPage }))
        setHasMore(newResults.length === params.per_page)
      } catch (error) {
        console.error("Error loading more data:", error)
      } finally {
        setLoading(false)
      }
    }
  }, [loading, hasMore, params, fetchData])

  const handleSort = useCallback(async (sorting: SortingState) => {
    console.log('Sorting state:', sorting)
    
    // If sorting is empty, reset to default sort
    if (!sorting || sorting.length === 0) {
      try {
        setLoading(true)
        setData([]) // Clear existing data
        setHasMore(true)
        
        const responseData = await fetchData({ 
          ...params, 
          page: 1, // Reset to first page
          sort: "cited_by_count:desc" // Default sort
        })
        
        setData(responseData.results)
        setParams(prev => ({ 
          ...prev, 
          page: 1,
          sort: "cited_by_count:desc"
        }))
        setHasMore(responseData.results.length === params.per_page)
      } catch (error) {
        console.error("Error resetting sort:", error)
      } finally {
        setLoading(false)
      }
      return
    }

    const sortInfo = sorting[0]
    if (!sortInfo) return

    const { id, desc } = sortInfo
    console.log('Sort info:', { id, desc, currentSort: params.sort })
    
    // If we're already sorting by this column, toggle the direction
    const currentSortParts = params.sort?.split(':') || []
    const isSameColumn = currentSortParts[0] === id
    const shouldToggleDirection = isSameColumn && currentSortParts[1] === (desc ? 'desc' : 'asc')
    
    const sortParam = `${id}:${shouldToggleDirection ? (desc ? 'asc' : 'desc') : (desc ? 'desc' : 'asc')}`
    console.log('New sort param:', sortParam)
    
    try {
      setLoading(true)
      setData([]) // Clear existing data
      setHasMore(true)
      
      const responseData = await fetchData({ 
        ...params, 
        page: 1, // Reset to first page
        sort: sortParam 
      })
      
      setData(responseData.results)
      setParams(prev => ({ 
        ...prev, 
        page: 1,
        sort: sortParam 
      }))
      setHasMore(responseData.results.length === params.per_page)
    } catch (error) {
      console.error("Error sorting data:", error)
    } finally {
      setLoading(false)
    }
  }, [params, fetchData])

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        const responseData = await fetchData(params)
        setData(responseData.results)
        setHasMore(responseData.results.length === params.per_page)
      } catch (error) {
        console.error("Error fetching initial data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData])

  const columns: ColumnDef<AcademicWork>[] = [
    {
      accessorKey: "title",
      header: "📖 Título",
      enableSorting: false,
      cell: (info) => {
        const title = info.getValue() as string
        const trimmedTitle = title && title.trim()
        if (!trimmedTitle) return null
        const formattedTitle = trimmedTitle.charAt(0).toUpperCase() + trimmedTitle.slice(1).toLowerCase()
        return formattedTitle.length > 100 ? `${formattedTitle.slice(0, 100)}...` : formattedTitle
      },
    },
    {
      accessorKey: "publication_year",
      header: "📅 Año",
      enableSorting: true,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "cited_by_count",
      header: "🔢 Citaciones",
      enableSorting: true,
      cell: (info) => {
        const value = info.getValue() as number
        return value.toLocaleString()
      },
    },
    {
      id: "authors",
      header: "👥 Autores",
      enableSorting: false,
      cell: ({ row }) => {
        const rawAuthors = row?.original?.authorships.length > 2 ? row.original.authorships.slice(0, 2) : row.original.authorships
        const authors = rawAuthors.map((a) => {
          const name = a.author.display_name
          if (name === "NULL AUTHOR_ID") return ""
          return name.length > 20 ? `${name.slice(0, 20)}...` : name
        }).join(", ")
        return <span>{authors}</span>
      },
    },
  ]

  if (loading && data.length === 0) {
    return <div className="flex items-center justify-center min-h-svh">Loading...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh px-4">
      <InteractiveTable 
        data={data} 
        columns={columns} 
        onLoadMore={loadMore}
        hasMore={hasMore}
        loading={loading}
        onSortingChange={handleSort}
      />
    </div>
  )
}

export default App
