import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center text-center space-y-4 mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About Our Web App</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Learn more about our mission, team, and the technology behind our web application.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:gap-12 mb-10">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground">
            Our mission is to create intuitive, powerful web applications that help businesses and individuals achieve
            their goals. We believe in the power of technology to transform how we work and live.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Our Vision</h2>
          <p className="text-muted-foreground">
            We envision a world where technology enhances human potential rather than replacing it. Our products are
            designed to be tools that amplify your capabilities and streamline your workflow.
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        <h2 className="text-2xl font-bold text-center">Our Technology Stack</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Frontend</CardTitle>
              <CardDescription>Modern UI technologies</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Next.js for server-side rendering</li>
                <li>React for component-based UI</li>
                <li>Tailwind CSS for styling</li>
                <li>TypeScript for type safety</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Backend</CardTitle>
              <CardDescription>Robust server technologies</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Node.js for server-side logic</li>
                <li>API routes for data fetching</li>
                <li>Database integration</li>
                <li>Authentication services</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure</CardTitle>
              <CardDescription>Scalable cloud solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Vercel for deployment</li>
                <li>CI/CD pipelines</li>
                <li>Monitoring and analytics</li>
                <li>Security best practices</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Get Started Today</h2>
        <p className="max-w-[700px] mx-auto text-muted-foreground">
          Ready to experience our web application? Sign up today and discover how we can help you achieve your goals.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Button asChild>
            <Link href="/dashboard">Explore Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
