import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Plus, Mail, Phone } from "lucide-react"

export default function TeamPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Team</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Team Member
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search team members..." className="w-full pl-8" />
        </div>
        <Button variant="outline">Filters</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <CardTitle className="text-base">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const teamMembers = [
  {
    id: "1",
    name: "John Doe",
    role: "CEO & Founder",
    email: "john@example.com",
    phone: "(123) 456-7890",
    avatar: "/placeholder.svg?height=48&width=48",
    initials: "JD",
  },
  {
    id: "2",
    name: "Sarah Smith",
    role: "CTO",
    email: "sarah@example.com",
    phone: "(123) 456-7891",
    avatar: "/placeholder.svg?height=48&width=48",
    initials: "SS",
  },
  {
    id: "3",
    name: "Michael Johnson",
    role: "Lead Developer",
    email: "michael@example.com",
    phone: "(123) 456-7892",
    avatar: "/placeholder.svg?height=48&width=48",
    initials: "MJ",
  },
  {
    id: "4",
    name: "Emily Davis",
    role: "UI/UX Designer",
    email: "emily@example.com",
    phone: "(123) 456-7893",
    avatar: "/placeholder.svg?height=48&width=48",
    initials: "ED",
  },
  {
    id: "5",
    name: "Robert Wilson",
    role: "Marketing Manager",
    email: "robert@example.com",
    phone: "(123) 456-7894",
    avatar: "/placeholder.svg?height=48&width=48",
    initials: "RW",
  },
  {
    id: "6",
    name: "Jennifer Lee",
    role: "Product Manager",
    email: "jennifer@example.com",
    phone: "(123) 456-7895",
    avatar: "/placeholder.svg?height=48&width=48",
    initials: "JL",
  },
  {
    id: "7",
    name: "David Brown",
    role: "Backend Developer",
    email: "david@example.com",
    phone: "(123) 456-7896",
    avatar: "/placeholder.svg?height=48&width=48",
    initials: "DB",
  },
  {
    id: "8",
    name: "Lisa Chen",
    role: "Content Strategist",
    email: "lisa@example.com",
    phone: "(123) 456-7897",
    avatar: "/placeholder.svg?height=48&width=48",
    initials: "LC",
  },
]
