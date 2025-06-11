
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const { subscribe, isLoading } = useNewsletterSubscription()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await subscribe(email)
    if (success) {
      setEmail("")
    }
  }

  return (
    <section className="py-12 bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Stay Informed
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Get the latest insights from the intersection of science and entrepreneurship delivered to your inbox.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white text-gray-900 border-0 h-12"
            required
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-8 h-12"
            disabled={isLoading}
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
        
        <p className="text-gray-400 text-sm mt-4 text-center">
          Weekly updates • No spam • Unsubscribe anytime
        </p>
      </div>
    </section>
  )
}
