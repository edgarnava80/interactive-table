import { Button } from "@/components/ui/button"

type AcademicWork = {
  title: string
  publication_year: number
  cited_by_count: number
  authorships: { author: { display_name: string } }[]
}

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

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <Button>Click me</Button>
    </div>
  )
}

export default App
