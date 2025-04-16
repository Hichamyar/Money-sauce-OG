import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Search, Plus, Download, Trash2 } from "lucide-react"

export default function DocumentsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Document
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search documents..." className="w-full pl-8" />
        </div>
        <Button variant="outline">Filters</Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{document.name}</span>
                  </div>
                </TableCell>
                <TableCell>{document.type}</TableCell>
                <TableCell>{document.size}</TableCell>
                <TableCell>{document.modified}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

const documents = [
  {
    id: "1",
    name: "Annual Report 2023.pdf",
    type: "PDF",
    size: "4.2 MB",
    modified: "Today, 10:45 AM",
  },
  {
    id: "2",
    name: "Project Proposal.docx",
    type: "Word",
    size: "2.1 MB",
    modified: "Yesterday, 3:30 PM",
  },
  {
    id: "3",
    name: "Financial Statement Q1.xlsx",
    type: "Excel",
    size: "1.8 MB",
    modified: "Mar 15, 2023",
  },
  {
    id: "4",
    name: "Marketing Strategy.pptx",
    type: "PowerPoint",
    size: "5.7 MB",
    modified: "Mar 12, 2023",
  },
  {
    id: "5",
    name: "Client Meeting Notes.txt",
    type: "Text",
    size: "12 KB",
    modified: "Mar 10, 2023",
  },
  {
    id: "6",
    name: "Product Roadmap.pdf",
    type: "PDF",
    size: "3.5 MB",
    modified: "Mar 8, 2023",
  },
  {
    id: "7",
    name: "Team Structure.png",
    type: "Image",
    size: "1.2 MB",
    modified: "Mar 5, 2023",
  },
  {
    id: "8",
    name: "Budget Overview 2023.xlsx",
    type: "Excel",
    size: "2.3 MB",
    modified: "Mar 1, 2023",
  },
]
