import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import type { AcademicWork } from "@/types"
import { useRef, useEffect } from "react"

interface InteractiveTableProps {
  data: AcademicWork[]
  columns: ColumnDef<AcademicWork>[]
  onLoadMore?: () => void
  hasMore?: boolean
  loading?: boolean
}

const InteractiveTable = ({ 
  data, 
  columns,
  onLoadMore,
  hasMore = false,
  loading = false
}: InteractiveTableProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 35,
    overscan: 5,
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
                        style={{
                          width: header.id === "title" ? "60%" :
                                 header.id === "publication_year" ? "5%" :
                                 header.id === "cited_by_count" ? "9%" :
                                 header.id === "authors" ? "26%" : "auto"
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
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
              <Table className="border-collapse">
                <TableBody>
                  <tr>
                    <td colSpan={columns.length} style={{ height: `${rowVirtualizer.getTotalSize()}px` }} />
                  </tr>
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index]
                    return (
                      <TableRow
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
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell 
                            key={cell.id}
                            style={{
                              width: cell.column.id === "title" ? "60%" :
                                     cell.column.id === "publication_year" ? "5%" :
                                     cell.column.id === "cited_by_count" ? "9%" :
                                     cell.column.id === "authors" ? "26%" : "auto"
                            }}
                            className={`whitespace-normal break-words ${
                              cell.column.id === "cited_by_count" ? "text-center" : ""
                            }`}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })}
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center">
                        Loading more...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="absolute top-0 left-0 right-0 bg-white z-10">
              <Table className="border-collapse">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead 
                          key={header.id}
                          style={{
                            width: header.id === "title" ? "60%" :
                                   header.id === "publication_year" ? "5%" :
                                   header.id === "cited_by_count" ? "9%" :
                                   header.id === "authors" ? "26%" : "auto"
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
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