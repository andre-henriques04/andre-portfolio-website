"use client"

import { useState, useEffect } from "react"
import { useForm, ValidationError } from "@formspree/react" // Import useForm and ValidationError
import { Moon, Sun, Menu, X, Github, Linkedin, Mail, ExternalLink, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(false) // Default to light mode
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [state, handleSubmit] = useForm("movwnoav") // Initialize Formspree hook

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [darkMode])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  const projects = [
    {
      title: "🤖 Context-Engineered Long-Lived Agent (CELLA)",
      description:
        "Full-stack AI agent with persistent vector memory, context compression, and live reasoning visualization. Features advanced agentic planning workflow with human-in-the-loop approvals and tool orchestration via MCP interface.",
      tech: ["Python", "Next.js", "OpenAI", "Model Context Protocol", "Docker"],
      github: "https://github.com/andre-henriques04/cella",
      demo: "https://cella-demo.com",
    },
    {
      title: "🎯 Pickleball Tournament Searcher & GPT Assistant",
      description:
        "RAG-based GPT assistant leveraging domain experience as a Pickleball Professional to answer player questions and improve tournament search, serving 100+ active users with AI-driven training recommendations.",
      tech: ["Python", "FastAPI", "OpenAI"],
      github: "https://github.com/andre-henriques04",
      demo: "#",
    },
  ]

  // If the form submission is successful, display a success message
  if (state.succeeded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
        <Card className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg text-center">
          <CardTitle className="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">
            Message Sent!
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
            Thanks for reaching out! I'll get back to you as soon as possible.
          </CardDescription>
          <Button
            onClick={() => window.location.reload()}
            className="mt-6 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 font-semibold"
          >
            Send another message
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark" : ""}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Navigation */}
        <nav
          className={`fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 transition-all duration-300 ${
            scrolled ? "border-b border-gray-200 dark:border-gray-700" : ""
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Andre Henriques
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8">
                {["Home", "About", "Experience", "Projects", "Study Abroad", "Contact"].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase().replace(" ", "-"))}
                    className="hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors font-medium"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => setDarkMode(!darkMode)} className="p-2">
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden p-2"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 py-2 space-y-2">
                {["Home", "About", "Experience", "Projects", "Study Abroad", "Contact"].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase().replace(" ", "-"))}
                    className="block w-full text-left py-2 hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors font-medium"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section id="home" className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:to-gray-800 opacity-90"></div>
          {/* Dynamic, animated "blob" shapes */}
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-emerald-300 dark:bg-emerald-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-blue-300 dark:bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center py-20">
              <div className="mb-8">
                <img
                  src="/andre-photo.jpeg"
                  alt="Andre Henriques"
                  className="w-32 h-32 rounded-full mx-auto mb-8 border-4 border-emerald-500 shadow-lg object-cover"
                />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Hi, I'm{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Andre
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto font-light">
                Software Engineering Intern passionate about <span className="text-emerald-400 font-semibold">AI</span>,{" "}
                <span className="text-blue-400 font-semibold">Machine Learning</span>, and building innovative solutions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  size="lg"
                  onClick={() => scrollToSection("projects")}
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 font-semibold"
                >
                  View My Projects
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("contact")}
                  className="border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-gray-900 font-semibold"
                >
                  Get In Touch
                </Button>
              </div>
              <div className="flex justify-center space-x-6">
                <a
                  href="https://github.com/andre-henriques04"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a
                  href="https://linkedin.com/in/drehenriques/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-400 transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  href="mailto:andre.henriques@gmail.com"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-400 dark:hover:text-purple-400 transition-colors"
                >
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>
            <div className="text-center">
              <ChevronDown className="h-8 w-8 mx-auto animate-bounce text-gray-400" />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">About Me</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Hi! I'm Andre, a <span className="text-blue-400">Brazilian-American</span> Computer Science undergrad
                  at Texas State University with a Minor in Mathematics. Being bilingual in Portuguese and English has
                  given me a unique perspective that I bring to everything I do.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Currently working as a Software Engineering Intern at{" "}
                  <span className="text-purple-400">Singular</span>, where I'm developing AI solutions using
                  Retrieval-Augmented Generation to elevate government tech and workflows.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  When I'm not coding, you'll find me on the <span className="text-emerald-400">pickleball court</span>!
                  I'm absolutely passionate about the sport and spent time as a Pickleball Professional, coaching
                  players and running tournaments. There's something magical about the strategy, athleticism, and
                  community that pickleball brings together.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  I'm also a proud member of <span className="text-yellow-400">American Mensa</span> and love exploring
                  new technologies, especially in the AI and machine learning space. Always excited to connect with
                  fellow tech enthusiasts and pickleball players!
                </p>
              </div>
              <div className="text-center">
                <img
                  src="/images/brazil-usa-flag-new.png"
                  alt="Brazilian and American flags representing dual heritage"
                  className="rounded-lg shadow-lg mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Experience</h2>
            <div className="space-y-8">
              <Card className="border-l-4 border-l-emerald-500 bg-gray-50 dark:bg-gray-800">
                <CardHeader>
                  <div className="flex justify-between w-full">
                    <div>
                      <CardTitle className="text-xl font-semibold">Software Engineering Intern</CardTitle>
                      <CardDescription className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
                        Singular
                      </CardDescription>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Brasília, Brazil</div>
                    </div>
                    <Badge variant="outline" className="border-emerald-400 text-emerald-600 dark:text-emerald-400">
                      May 2025 - Aug 2025
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Developing AI solutions using Retrieval-Augmented Generation to elevate government tech and
                    workflows. Working with cutting-edge technologies to streamline internal processes and improve user
                    experiences.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500 bg-gray-50 dark:bg-gray-800">
                <CardHeader>
                  <div className="flex justify-between w-full">
                    <div>
                      <CardTitle className="text-xl font-semibold">Pickleball Professional</CardTitle>
                      <CardDescription className="text-lg font-medium text-blue-600 dark:text-blue-400">
                        Life Time, Inc.
                      </CardDescription>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Austin, Texas</div>
                    </div>
                    <Badge variant="outline" className="border-blue-400 text-blue-600 dark:text-blue-400">
                      Jun 2023 - Jan 2025
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Coached 500+ students across all skill levels, driving measurable improvement in skill retention.
                    Managed clinics and tournaments, increasing member engagement by 60% and event participation by 90%.
                    Fostered long-term client relationships, achieving a 95% client retention rate through feedback,
                    analysis, and mentorship.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Featured Projects</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="subtle" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                      >
                        <Github className="h-4 w-4 mr-1" />
                        Code
                      </a>
                      <a className="flex items-center text-sm text-gray-400 cursor-not-allowed font-medium">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Demo
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Study Abroad Section */}
        <section id="study-abroad" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center mb-12">
              <img
                src="/images/italy-flag.png"
                alt="Italian flag"
                className="w-12 h-8 rounded-md shadow-md mr-4 object-cover"
              />
              <h2 className="text-4xl font-bold text-center">Study Abroad in Siena, Italy</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  As a Brazilian-American fluent in Portuguese and English, with professional Spanish skills, I sought
                  to broaden my perspective beyond my experiences in Brazil and the U.S. The{" "}
                  <span className="text-red-400 font-medium">CET Siena program</span>, sponsored by the University of
                  Virginia, provided the perfect opportunity for this cultural immersion.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Being the only student from my university among approximately 70 students, mostly from UVA, I focused
                  on building new connections. I shared a living space with five Americans and a local Italian roommate,
                  creating a rich cultural exchange. <span className="text-green-400 font-medium">Siena</span> itself is
                  a beautiful city, offering a short walk to class and historical charm around every corner.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  During my time there, I explored various parts of Italy, including{" "}
                  <span className="text-yellow-400 font-medium">Rome and Bologna</span>, and ventured further to{" "}
                  <span className="text-blue-400 font-medium">Switzerland and Morocco</span>, enriching my experience
                  even more. My study abroad in Siena provided invaluable new perspectives and unforgettable memories.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <img
                  src="/images/siena-selfie.jpeg"
                  alt="Andre in Siena, Italy"
                  className="rounded-lg shadow-lg object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="/images/siena-mountains.jpeg"
                  alt="Andre and friends in snowy mountains during study abroad"
                  className="rounded-lg shadow-lg object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="/images/siena-morocco-flag.jpeg"
                  alt="Andre and friends holding a flag in Morocco"
                  className="rounded-lg shadow-lg object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="/images/siena-morocco-dunes.jpeg"
                  alt="Andre and friend on sand dunes in Morocco"
                  className="rounded-lg shadow-lg object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Get In Touch</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-emerald-400">Let's Connect!</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  I'm always interested in discussing new opportunities, collaborating on projects, or just chatting
                  about technology and AI.{" "}
                  <span className="text-blue-400 font-medium">Fellow pickleball enthusiasts</span> are especially
                  welcome! Feel free to reach out.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-purple-400" />
                    <span className="font-medium">andre.henriques@gmail.com</span>
                  </div>
                  <div className="flex items-center">
                    <Linkedin className="h-5 w-5 mr-3 text-blue-400" />
                    <a
                      href="https://linkedin.com/in/drehenriques/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline font-medium text-blue-400"
                    >
                      linkedin.com/in/drehenriques/
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Github className="h-5 w-5 mr-3 text-emerald-400" />
                    <a
                      href="https://github.com/andre-henriques04"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline font-medium text-emerald-400"
                    >
                      github.com/andre-henriques04
                    </a>
                  </div>
                </div>
              </div>
              <Card className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Send me a message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name" // Added name attribute
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700"
                        required
                      />
                      <ValidationError prefix="Name" field="name" errors={state.errors} />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email" // Added name attribute
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700"
                        required
                      />
                      <ValidationError prefix="Email" field="email" errors={state.errors} />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message" // Added name attribute
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700"
                        required
                      ></textarea>
                      <ValidationError prefix="Message" field="message" errors={state.errors} />
                    </div>
                    <Button
                      type="submit"
                      disabled={state.submitting} // Disable button during submission
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 font-semibold"
                    >
                      {state.submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-600 dark:text-gray-300">© 2025 Andre Henriques.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
