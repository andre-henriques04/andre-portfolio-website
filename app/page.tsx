"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useForm } from "@formspree/react"
import { Moon, Sun, Menu, X, Github, Linkedin, Mail, ExternalLink, ArrowDown, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"

// Interactive 3D Orb Component with Physics
function Interactive3DOrb() {
  const orbRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 180 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 })
  const [lastTime, setLastTime] = useState(0)
  const animationRef = useRef<number>()
  const velocityRef = useRef({ x: 0, y: 0 })
  const rotationRef = useRef({ x: 0, y: 180 })

  // Physics constants
  const DAMPING = 0.95 // How quickly momentum decays (0-1, closer to 1 = less friction)
  const SENSITIVITY = 0.5 // Mouse movement sensitivity
  const MIN_VELOCITY = 0.01 // Minimum velocity before stopping animation

  // Update refs when state changes
  useEffect(() => {
    velocityRef.current = velocity
    rotationRef.current = rotation
  }, [velocity, rotation])

  // Animation loop for momentum
  const animate = () => {
    const currentVelocity = velocityRef.current
    const currentRotation = rotationRef.current

    // Check if we should continue animating
    if (Math.abs(currentVelocity.x) < MIN_VELOCITY && Math.abs(currentVelocity.y) < MIN_VELOCITY) {
      setVelocity({ x: 0, y: 0 })
      return
    }

    // Apply velocity to rotation
    const newRotation = {
      x: currentRotation.x + currentVelocity.x,
      y: currentRotation.y + currentVelocity.y,
    }

    // Apply damping to velocity
    const newVelocity = {
      x: currentVelocity.x * DAMPING,
      y: currentVelocity.y * DAMPING,
    }

    setRotation(newRotation)
    setVelocity(newVelocity)

    // Continue animation
    animationRef.current = requestAnimationFrame(animate)
  }

  // Start momentum animation when velocity is set
  useEffect(() => {
    if (!isDragging && (Math.abs(velocity.x) > MIN_VELOCITY || Math.abs(velocity.y) > MIN_VELOCITY)) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [velocity, isDragging])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const currentTime = Date.now()
      const deltaTime = currentTime - lastTime
      const deltaX = e.clientX - lastMouse.x
      const deltaY = e.clientY - lastMouse.y

      // Calculate velocity based on movement and time
      const velocityX = deltaTime > 0 ? (deltaY * SENSITIVITY) / (deltaTime / 16) : 0 // Normalize to 60fps
      const velocityY = deltaTime > 0 ? (deltaX * SENSITIVITY) / (deltaTime / 16) : 0

      // Apply rotation immediately
      setRotation((prev) => ({
        x: prev.x + deltaY * SENSITIVITY,
        y: prev.y + deltaX * SENSITIVITY,
      }))

      // Store velocity for momentum
      setVelocity({ x: velocityX, y: velocityY })

      setLastMouse({ x: e.clientX, y: e.clientY })
      setLastTime(currentTime)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      // Velocity is already set from the last mouse move, momentum will continue
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, lastMouse, lastTime])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMouse({ x: e.clientX, y: e.clientY })
    setLastTime(Date.now())
    setVelocity({ x: 0, y: 0 }) // Stop any existing momentum

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div
        ref={orbRef}
        className="relative w-96 h-96 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
        }}
      >
        {/* Main Orb Core */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 opacity-90"
          style={{
            transform: "translateZ(0px)",
            boxShadow: "0 0 60px rgba(59, 130, 246, 0.5), inset 0 0 60px rgba(147, 51, 234, 0.3)",
          }}
        ></div>

        {/* Outer Ring 1 */}
        <div
          className="absolute inset-0 rounded-full border-4 border-blue-300 opacity-40"
          style={{
            transform: "translateZ(20px) rotateX(45deg)",
            animation: "spin 20s linear infinite",
          }}
        ></div>

        {/* Outer Ring 2 */}
        <div
          className="absolute inset-4 rounded-full border-4 border-purple-300 opacity-50"
          style={{
            transform: "translateZ(40px) rotateY(45deg)",
            animation: "spin 15s linear infinite reverse",
          }}
        ></div>

        {/* Outer Ring 3 */}
        <div
          className="absolute inset-8 rounded-full border-4 border-pink-300 opacity-60"
          style={{
            transform: "translateZ(60px) rotateX(-30deg) rotateY(30deg)",
            animation: "spin 10s linear infinite",
          }}
        ></div>

        {/* Inner Glow Layer */}
        <div
          className="absolute inset-12 rounded-full bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 opacity-70"
          style={{
            transform: "translateZ(-10px)",
            animation: "pulse 3s ease-in-out infinite alternate",
          }}
        ></div>

        {/* Core Sphere */}
        <div
          className="absolute inset-20 rounded-full bg-gradient-to-br from-white via-cyan-200 to-blue-300 opacity-90"
          style={{
            transform: "translateZ(-20px)",
            boxShadow: "inset 0 0 30px rgba(255, 255, 255, 0.5)",
          }}
        ></div>

        {/* Floating Particles in 3D Space */}
        {[...Array(16)].map((_, i) => {
          const angle = (i * 22.5 * Math.PI) / 180
          const radius = 180
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          const z = Math.sin(angle * 2) * 30

          return (
            <div
              key={i}
              className="absolute w-3 h-3 bg-white rounded-full opacity-80"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: `translateZ(${z}px) translate(-50%, -50%)`,
                animation: `float 4s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
              }}
            ></div>
          )
        })}

        {/* Energy Waves */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`wave-${i}`}
            className="absolute inset-0 rounded-full border-2 border-emerald-400 opacity-30"
            style={{
              transform: `translateZ(${(i + 1) * 15}px) scale(${1 + i * 0.1})`,
              animation: `pulse 2s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          ></div>
        ))}

        {/* Hover Glow Effect */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 opacity-0 hover:opacity-20 transition-opacity duration-300"
          style={{
            transform: "translateZ(5px)",
            filter: "blur(20px)",
          }}
        ></div>
      </div>
    </div>
  )
}

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(true) // Default to dark mode
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [state, handleSubmit] = useForm("movwnoav")

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
        "RAG-based GPT assistant leveraging domain experience as a Pickleball Professional to answer player questions and improve tournament search, 100+ active users with AI-driven training recommendations.",
      tech: ["Python", "FastAPI", "OpenAI"],
      github: "https://github.com/andre-henriques04",
      demo: "#",
    },
  ]

  if (state.succeeded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center max-w-2xl mx-auto px-4">
          {/* Success Animation */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-pulse opacity-75"></div>
              <div
                className="relative w-28 h-28 bg-gray-800 rounded-full mx-auto border-4 border-gray-700 shadow-xl flex items-center justify-center z-10"
                style={{
                  position: "relative",
                  top: "8px",
                  left: "8px",
                }}
              >
                <Send className="h-12 w-12 text-emerald-500" />
              </div>
            </div>
          </div>

          <Card className="bg-gray-800/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-gray-700">
            <CardTitle className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Message Sent Successfully! 🎉
            </CardTitle>
            <CardDescription className="text-xl text-gray-300 mb-6">
              Thanks for reaching out! I'll get back to you as soon as possible.
              <br />
              <span className="text-emerald-400 font-semibold">Usually within 24 hours!</span>
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Send Another Message
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToSection("home")}
                className="border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Back to Portfolio
              </Button>
            </div>
          </Card>
        </div>
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
              <div className="text-xl font-bold">
                <span className="text-gray-900 dark:text-white">Andre</span>
                <span className="text-emerald-500">.</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8">
                {["Home", "About", "Experience", "Projects", "Study Abroad", "Contact"].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase().replace(" ", "-"))}
                    className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors font-medium text-sm"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => setDarkMode(!darkMode)} className="p-2">
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden p-2"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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

        {/* Hero Section - Redesigned */}
        <section
          id="home"
          className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950"></div>

            {/* Floating Geometric Shapes */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200 dark:bg-emerald-800 rounded-full opacity-20 animate-pulse"></div>
            <div
              className="absolute top-40 right-20 w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-lg opacity-20 animate-bounce"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-40 left-20 w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute bottom-20 right-40 w-24 h-24 bg-yellow-200 dark:bg-yellow-800 rounded-lg opacity-20 animate-bounce"
              style={{ animationDelay: "0.5s" }}
            ></div>

            {/* Flowing Lines */}
            <svg
              className="absolute inset-0 w-full h-full opacity-10"
              viewBox="0 0 1000 1000"
              preserveAspectRatio="none"
            >
              <path
                d="M0,300 Q250,100 500,300 T1000,300"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-emerald-500"
              />
              <path
                d="M0,600 Q250,400 500,600 T1000,600"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-blue-500"
              />
            </svg>
          </div>

          <div className="relative z-10 text-center max-w-5xl mx-auto">
            {/* Profile Image */}
            <div className="mb-8 relative">
              <div className="w-32 h-32 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-spin-slow opacity-75"></div>
                <img
                  src="/andre-photo.jpeg"
                  alt="Andre Henriques"
                  className="relative w-28 h-28 rounded-full mx-auto border-4 border-white dark:border-gray-800 shadow-xl object-cover z-10"
                  style={{
                    position: "relative",
                    top: "8px",
                    left: "8px",
                  }}
                />
              </div>
            </div>

            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-black mb-4 leading-tight">
                <span className="text-gray-900 dark:text-white">yo, i'm </span> 
                <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  andre
                </span>
                <span className="text-emerald-500">!</span>
              </h1>

              <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 font-light max-w-4xl mx-auto leading-relaxed">
                <span className="text-gray-900 dark:text-white"> aspiring </span> 
                <span className="text-emerald-500 font-semibold">  software engineer </span>
                <span className="text-gray-900 dark:text-white"> passionate about </span> 
                <span className="text-blue-500 font-semibold">ai</span>
                <span className="text-gray-900 dark:text-white">, </span> 
                <span className="text-purple-500 font-semibold">machine learning</span>
                <span className="text-gray-900 dark:text-white">, and building </span> 
                <span className="text-emerald-500 font-semibold">innovative solutions</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={() => scrollToSection("projects")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                view my work
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("contact")}
                className="border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                let's connect
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-6 mb-16">
              <a
                href="https://github.com/andre-henriques04"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-all duration-300 transform hover:scale-110 group"
              >
                <Github className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-emerald-500" />
              </a>
              <a
                href="https://linkedin.com/in/drehenriques/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-300 transform hover:scale-110 group"
              >
                <Linkedin className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-500" />
              </a>
              <a
                href="mailto:andre.henriques@gmail.com"
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900 transition-all duration-300 transform hover:scale-110 group"
              >
                <Mail className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-purple-500" />
              </a>
            </div>

            {/* Scroll Indicator */}
            <div className="animate-bounce">
              <ArrowDown className="h-6 w-6 mx-auto text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12 items-center">
              {/* Main Content - Left Side */}
              <div className="lg:col-span-2 space-y-8">
                {/* Who Am I Header */}
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wider uppercase mb-4">WHO AM I?</p>
                  <h3 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-8">
                    Who are <span className="italic font-light">you</span>??
                  </h3>
                  
                  <div className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed space-y-6 max-w-4xl">
                    <p>
                      I'm an <span className="text-blue-500 font-bold">aspiring software engineer</span> studying{" "}
                      <span className="text-emerald-500 font-bold">Computer Science</span> with a{" "}
                      <span className="text-purple-500 font-bold">Math minor</span> at{" "}
                      <span className="text-red-500 font-bold">Texas State University</span>. Currently working as a{" "}
                      <span className="text-emerald-500 font-bold">Software Engineering Intern</span> at{" "}
                      <span className="text-blue-500 font-bold">Singular</span>, where I'm building{" "}
                      <span className="text-purple-500 font-bold">AI tools</span> to improve government tech and workflows.
                    </p>
                    
                    <p>
                      When I'm not on the computer, you'll find me coaching and playing{" "}
                      <span className="text-yellow-500 font-bold">pickleball</span>  — the sport's strategy and community keep me hooked. I've coached{" "}
                      <span className="text-emerald-500 font-bold">500+ students</span> and love seeing players improve. 
                    </p>
                  </div>
                </div>

                {/* What I'm Passionate About */}
                <div className="mt-12">
                  <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">What I'm <span className="italic font-light">passionate</span> about</h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h5 className="text-xl font-bold text-emerald-500">Technology</h5>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                          <span>AI & Machine Learning</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span>Government Technology</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          <span>Full-Stack Development</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h5 className="text-xl font-bold text-yellow-500">Sports & Leadership</h5>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                          <span>Pickleball Coaching</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          <span>Sports Management</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                          <span>Tournament Organization</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h5 className="text-xl font-bold text-pink-500">Culture & Learning</h5>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                          <span>Cultural Exchange</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                          <span>Language Learning</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                          <span>International Travel</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fun Facts */}
                <div className="mt-12">
                  <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Fun <span className="italic font-light">facts</span></h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">American Mensa Member</span>
                      <span className="text-2xl">🧠</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">4 Languages Spoken    <span className="text-2xl">🌍</span></span>
                      
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Studied abroad in Italy   <span className="text-2xl">🇮🇹</span></span>
                      
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Visual Elements */}
              <div className="space-y-8 mt-12 lg:mt-0">
                {/* Texas State Logo */}
                <div className="text-center">
                  <img
                    src="/images/texas-state-logo.png"
                    alt="Texas State University Logo"
                    className="h-16 w-16 object-contain mx-auto mb-4"
                  />
                  <h5 className="font-bold text-gray-900 dark:text-white">Texas State University</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Computer Science & Math</p>
                </div>

                {/* Heritage */}
                <div >
                  <h5 className="font-bold text-gray-900 dark:text-white mb-4 text-center">My Heritage</h5>
                  <img
                    src="/images/brazil-usa-flag-new.png"
                    alt="Brazilian and American flags"
                    className="rounded-lg shadow-md mx-auto"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
                    Bringing together Brazilian and American cultures
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black mb-4 text-gray-900 dark:text-white">what i've been up to</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">my professional journey so far</p>
            </div>

            {/* Timeline Container */}
            <div className="relative">
              {/* Central Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-emerald-400 via-blue-500 to-purple-600 rounded-full"></div>

              {/* Experience Items */}
              <div className="space-y-16">
                {/* Singular Experience */}
                <div className="relative flex items-center">
                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10"></div>

                  {/* Content Card - Right Side */}
                  <div className="w-full md:w-5/12 md:ml-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      {/* Company Logo Placeholder */}
                      
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mr-4 shadow-lg p-2">
                          <img
                            src="/images/singular-logo-new.png"
                            alt="Singular Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Software Engineering Intern</h3>
                          <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">Singular</p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Brasília, Brazil</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="inline-block bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full text-sm font-medium">
                          May 2025 - Present
                        </span>
                      </div>

                      <div className="space-y-3 text-gray-600 dark:text-gray-300">
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <p>
                            Developing AI solutions using Retrieval-Augmented Generation to elevate government tech and
                            workflows
                          </p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <p>
                            Working with cutting-edge technologies to streamline internal processes and improve user
                            experiences
                          </p>
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div className="mt-6 flex flex-wrap gap-2">
                        {["AI/ML", "RAG", "Python", "Government Tech"].map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Life Time Experience */}
                <div className="relative flex items-center">
                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10"></div>

                  {/* Content Card - Left Side */}
                  <div className="w-full md:w-5/12">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      {/* Company Logo */}
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mr-4 shadow-lg p-2">
                          <img
                            src="/images/lifetime-pickleball-logo-new.png"
                            alt="Life Time Pickleball Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Pickleball Professional</h3>
                          <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">Life Time, Inc.</p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Austin, Texas</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                          Jun 2023 - Present
                        </span>
                      </div>

                      <div className="space-y-3 text-gray-600 dark:text-gray-300">
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <p>
                            Coached <strong>500+ students</strong> across all skill levels, driving measurable improvement in
                            skill retention
                          </p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <p>
                            Managed clinics and tournaments, increasing member engagement by <strong>60%</strong> and event
                            participation by <strong>90%</strong>
                          </p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <p>
                            Achieved <strong>95% client retention rate</strong> through feedback, analysis, and mentorship
                          </p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mt-6 flex flex-wrap gap-2">
                        {["Coaching", "Leadership", "Sports Management", "Client Relations"].map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section
          id="projects"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black mb-4 text-gray-900 dark:text-white">stuff i've built</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                projects that showcase my passion for ai & innovation
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* CELLA Project */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">CELLA</h3>
                        <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Context-Engineered Long-Lived Agent
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      
                    </div>
                  </div>

                  {/* Project Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Full-stack AI agent with{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">persistent vector memory</span>,
                    context compression, and live reasoning visualization. Features advanced agentic planning workflow with
                    <span className="text-blue-600 dark:text-blue-400 font-semibold"> human-in-the-loop approvals</span> and
                    tool orchestration via MCP interface.
                  </p>

                  {/* Key Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                      Key Features
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                        Vector Memory
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Live Reasoning
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        Context Compression
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        Tool Orchestration
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["Python", "Next.js", "OpenAI", "Model Context Protocol", "Docker"].map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <a
                      href="https://github.com/andre-henriques04/cella"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      View Code
                    </a>
                    <button className="flex items-center px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-xl font-semibold cursor-not-allowed">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Demo Soon
                    </button>
                  </div>
                </div>
              </div>

              {/* Pickleball GPT Project */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Pickleball GPT</h3>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold">Tournament Searcher & AI Assistant</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      
                    </div>
                  </div>

                  {/* Project Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">RAG-based GPT assistant</span> leveraging
                    domain experience as a Pickleball Professional to answer player questions and improve tournament search,
                    serving <span className="text-purple-600 dark:text-purple-400 font-semibold">... active users</span> with
                    AI-driven training recommendations.
                  </p>

                  {/* Key Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                      Key Features
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        RAG Architecture
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        Tournament Search
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                        Training Recommendations
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        Player Q&A
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["Python", "FastAPI", "OpenAI", "RAG", "Vector DB"].map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <a
                      href="https://github.com/andre-henriques04"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      View Code
                    </a>
                    <button className="flex items-center px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-xl font-semibold cursor-not-allowed">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Private Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Projects Teaser */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                <span className="text-gray-600 dark:text-gray-400 mr-2">More projects coming soon</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Study Abroad Section */}
        <section
          id="study-abroad"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-blue-950 dark:via-gray-900 dark:to-teal-950"
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <img
                  src="/images/italy-flag.png"
                  alt="Italian flag"
                  className="w-16 h-12 rounded-lg shadow-lg mr-4 object-cover border-2 border-white dark:border-gray-700"
                />
                <h2 className="text-5xl font-black text-gray-900 dark:text-white">ciao from siena!</h2>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                my spring 2025 semester abroad in italy was a life-changing adventure that broadened my perspective and created
                unforgettable memories
              </p>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
              {/* Story Content */}
              <div className="space-y-8">

                {/* Story Sections */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <span className="text-2xl mr-3">🌍</span>
                      why siena?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      I chose Siena because I wanted something different from what I was getting at university. I had already lived in Brazil for five years, so I had experience living outside the U.S., but I'd never been in a <span className="text-blue-500 font-semibold">European environment</span> like this one — especially somewhere I didn't know anyone. I wanted to <span className="text-emerald-500 font-semibold">push myself out of my comfort zone</span> and discover more about myself in a completely new environment.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <span className="text-2xl mr-3">🏠</span>
                      living the experience
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Being the <span className="text-emerald-500 font-semibold">only student from my university</span> among 70 students (mostly from UVA), I focused on building new connections. I shared a living space with five Americans and a local Italian roommate, creating rich cultural exchange. <span className="text-green-500 font-semibold">Siena</span> is a beautiful city with historical charm around every corner.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <span className="text-2xl mr-3">✈️</span>
                      adventures beyond italy
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      During my time there, I explored various parts of Italy, including <span className="text-yellow-500 font-semibold">Rome, Bologna, Florence, and Milan</span>. I also ventured beyond Italy to <span className="text-blue-500 font-semibold">Switzerland</span> and <span className="text-red-500 font-bold">Morocco</span>, enriching my experience even more. My study abroad in Siena provided invaluable new perspectives and unforgettable memories.
                    </p>
                  </div>
                </div>

                 

                {/* Countries Visited */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    countries explored during my semester
                  </h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center group">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-400 to-green-400 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">🇮🇹</span>
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Italy</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Home base in Siena</p>
                    </div>

                    <div className="text-center group">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-400 to-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">🇨🇭</span>
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Switzerland</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Alpine adventures</p>
                    </div>

                    <div className="text-center group">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-400 to-green-400 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">🇲🇦</span>
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Morocco</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sahara Desert</p>
                    </div>

                    <div className="text-center group">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-red-400 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">🇺🇸</span>
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Back Home</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">With new perspectives</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Gallery */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="group relative overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src="/images/siena-selfie.jpeg"
                      alt="Andre in Siena, Italy"
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="font-semibold">Exploring Siena</p>
                      <p className="text-sm">Historic city center</p>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src="/images/siena-mountains.jpeg"
                      alt="Andre and friends in snowy mountains during study abroad"
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="font-semibold">Swiss Alps</p>
                      <p className="text-sm">Winter adventure</p>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src="/images/siena-morocco-flag.jpeg"
                      alt="Andre and friends holding a flag in Morocco"
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="font-semibold">Morocco Trip</p>
                      <p className="text-sm">Cultural immersion</p>
                    </div>
                  </div>

                  <div className="group relative overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src="/images/siena-morocco-dunes.jpeg"
                      alt="Andre and friend on sand dunes in Morocco"
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="font-semibold">Sahara Desert</p>
                      <p className="text-sm">Unforgettable experience</p>
                    </div>
                  </div>
                </div>

                {/* Impact Statement */}
                <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-8 text-white shadow-xl">
                  <h3 className="text-2xl font-bold mb-4 flex items-center">
                    <span className="text-2xl mr-3">💭</span>
                    the impact
                  </h3>
                  <p className="text-lg leading-relaxed">
                    This experience taught me that <span className="font-semibold">stepping outside your comfort zone</span>{" "}
                    is where real growth happens. Living with people from different backgrounds, navigating a new culture, and
                    exploring diverse countries gave me perspectives I never would have gained otherwise.
                  </p>
                </div>
              </div>

              {/* Countries Visited */}
            </div>
          </section>

          {/* Contact Section - With Interactive 3D Orb */}
          <section
            id="contact"
            className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-black relative overflow-hidden"
          >
            {/* Starry Background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 dark:from-black dark:via-gray-900 dark:to-blue-900"></div>
              {/* Stars */}
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                ></div>
              ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
                {/* Left Side - Form */}
                <div className="space-y-8">
                  <div>
                    <p className="text-gray-400 text-sm font-medium tracking-wider uppercase mb-4">GET IN TOUCH</p>
                    <h2 className="text-6xl md:text-7xl font-black text-white mb-8">Contact.</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                      <label className="block text-white text-lg font-medium mb-3">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="What's your name?"
                        className="w-full bg-transparent border-b-2 border-gray-600 text-white text-lg py-3 px-0 focus:outline-none focus:border-emerald-400 transition-colors duration-300 placeholder-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white text-lg font-medium mb-3">Your Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="What's your email?"
                        className="w-full bg-transparent border-b-2 border-gray-600 text-white text-lg py-3 px-0 focus:outline-none focus:border-emerald-400 transition-colors duration-300 placeholder-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white text-lg font-medium mb-3">Your Message</label>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="What do you want to say?"
                        className="w-full bg-transparent border-b-2 border-gray-600 text-white text-lg py-3 px-0 focus:outline-none focus:border-emerald-400 transition-colors duration-300 placeholder-gray-500 resize-none"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={state.submitting}
                      className="group relative bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {state.submitting ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        "Send"
                      )}
                    </button>
                  </form>
                </div>

                {/* Right Side - Interactive 3D Orb */}
                <Interactive3DOrb />
              </div>
            </div>
            {/* Footer - Integrated into Contact Section */}
            <div className="relative z-10 border-t border-gray-700/30 pt-12 mt-20">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <p className="text-gray-400">© 2025 Andre Henriques</p>
                  </div>
                  <div className="flex space-x-6">
                    <a
                      href="https://github.com/andre-henriques04"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    <a
                      href="https://linkedin.com/in/drehenriques/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href="mailto:andre.henriques@gmail.com"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
}
