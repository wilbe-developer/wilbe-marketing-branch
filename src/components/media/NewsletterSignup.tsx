
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          STAY UPDATED
        </h2>
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          Get the latest content, industry insights, and founder stories delivered to your inbox weekly.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white text-gray-900 border-0"
            required
          />
          <Button type="submit" className="bg-white text-gray-900 hover:bg-gray-100 font-bold uppercase tracking-wide px-6">
            Subscribe
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
        
        <p className="text-gray-400 text-sm mt-4">
          No spam. Unsubscribe at any time.
        </p>
      </div>
    </section>
  )
}
