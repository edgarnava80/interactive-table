import { type ColumnDef } from "@tanstack/react-table"
import type { AcademicWork } from "@/types"
import InteractiveTable from "@/components/InteractiveTable"

const data: AcademicWork[] = [
  {
    title: "A Deep Dive into Neural Networks",
    publication_year: 2021,
    cited_by_count: 150,
    authorships: [
      { author: { display_name: "Alice Smith" } },
      { author: { display_name: "Bob Johnson" } },
    ],
  },
  {
    title: "Quantum Computing for Beginners",
    publication_year: 2020,
    cited_by_count: 98,
    authorships: [
      { author: { display_name: "Carlos Rivera" } },
    ],
  },
  {
    title: "Understanding GPT Models",
    publication_year: 2023,
    cited_by_count: 75,
    authorships: [
      { author: { display_name: "Dana Lee" } },
      { author: { display_name: "Ethan Brown" } },
      { author: { display_name: "Moe Green" } },
    ],
  },
]

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

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <InteractiveTable data={data} columns={columns} />
    </div>
  )
}

export default App
