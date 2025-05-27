import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import type { AcademicWork } from "@/types"

const InteractiveTable = ({ data, columns }: { data: AcademicWork[], columns: ColumnDef<AcademicWork>[] }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
            <div className="overflow-auto max-h-[600px]">
              <Table className="border-collapse">
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
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
                  ))}
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