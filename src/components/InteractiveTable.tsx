import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead } from "@/components/ui/table"
import type { AcademicWork } from "@/types"
import { useRef, useEffect, useState } from "react"

interface InteractiveTableProps {
  data: AcademicWork[]
  columns: ColumnDef<AcademicWork>[]
  onLoadMore?: () => void
  hasMore?: boolean
  loading?: boolean
  onSortingChange?: (sorting: SortingState) => void
}

const InteractiveTable = ({ 
  data, 
  columns,
  onLoadMore,
  hasMore = false,
  loading = false,
  onSortingChange
}: InteractiveTableProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updatedSorting) => {
      console.log('Table sorting update:', updatedSorting)
      const newSorting = typeof updatedSorting === 'function' 
        ? updatedSorting(sorting)
        : updatedSorting
      console.log('New sorting state:', newSorting)
      setSorting(newSorting)
      onSortingChange?.(newSorting)
    },
    state: {
      sorting,
    },
    enableMultiSort: false,
    enableSorting: true,
  })

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 35,
  })

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer || !onLoadMore) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer
      const scrollBottom = scrollTop + clientHeight
      const threshold = scrollHeight - clientHeight * 1.5 // Load more when 1.5 viewports from bottom

      if (scrollBottom >= threshold && !loading && hasMore) {
        onLoadMore()
      }
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [hasMore, loading, onLoadMore])

  return (
    <Card className="w-full mt-4 shadow-md">
      <CardContent>
        <div className="relative">
          <div className="relative">
            <Table className="border-collapse">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead 
                        key={header.id}
                        className="text-sm cursor-pointer hover:bg-gray-100"
                        style={{
                          width: header.id === "title" ? "55%" :
                                 header.id === "publication_year" ? "10%" :
                                 header.id === "cited_by_count" ? "12%" :
                                 header.id === "authors" ? "23%" : "auto"
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
            </Table>
            <div 
              ref={scrollContainerRef}
              className="overflow-auto max-h-[600px]"
            >
              <div 
                style={{ 
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '55% 10% 12% 23%',
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index]
                    return (
                      <div
                        key={virtualRow.index}
                        data-index={virtualRow.index}
                        ref={virtualRow.index === rows.length - 1 ? (node) => {
                          if (node) {
                            rowVirtualizer.measureElement(node)
                          }
                        } : undefined}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                          display: 'grid',
                          gridTemplateColumns: '55% 10% 12% 23%',
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <div
                            key={cell.id}
                            className={`p-4 text-sm ${
                              cell.column.id === "cited_by_count" ? "text-center" : ""
                            } whitespace-normal break-words`}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </div>
              {loading && (
                <div className="text-center p-4 text-sm">
                  Loading more...
                </div>
              )}
            </div>
            <div className="absolute top-0 left-0 right-0 bg-white z-10">
              <Table className="border-collapse">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead 
                          key={header.id}
                          className="text-sm cursor-pointer hover:bg-gray-100"
                          style={{
                            width: header.id === "title" ? "55%" :
                                   header.id === "publication_year" ? "10%" :
                                   header.id === "cited_by_count" ? "12%" :
                                   header.id === "authors" ? "23%" : "auto"
                          }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center gap-2">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default InteractiveTable