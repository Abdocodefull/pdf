"use client"

import type React from "react"
import { useRef, useState } from "react"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Send, FileText, Bot, User, BookOpen, GraduationCap } from "lucide-react"

async function convertFilesToDataURLs(
  files: FileList,
): Promise<{ type: "file"; filename: string; mediaType: string; url: string }[]> {
  return Promise.all(
    Array.from(files).map(
      (file) =>
        new Promise<{
          type: "file"
          filename: string
          mediaType: string
          url: string
        }>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            resolve({
              type: "file",
              filename: file.name,
              mediaType: file.type,
              url: reader.result as string,
            })
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        }),
    ),
  )
}

export default function Chat() {
  const [input, setInput] = useState("")
  const [files, setFiles] = useState<FileList | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, isLoading } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!input.trim() && (!files || files.length === 0)) return

    const fileParts = files && files.length > 0 ? await convertFilesToDataURLs(files) : []

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: input }, ...fileParts],
    })

    setInput("")
    setFiles(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
      <div className="container mx-auto max-w-6xl px-4 py-6">
        {/* Header Section */}
        <header className="mb-8">
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-lg">
            <CardHeader className="text-center py-12">
              <div className="flex flex-col items-center space-y-6">
                <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-2xl">
                  <GraduationCap className="h-16 w-16 text-white" />
                </div>

                <CardTitle className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Smart Curriculum Assistant
                </CardTitle>

                <p className="text-gray-700 text-xl font-medium max-w-2xl leading-relaxed">
                  Upload your curriculum PDF and ask intelligent questions about its educational content
                </p>

                <div className="flex items-center justify-center gap-8 mt-8">
                  <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                    <BookOpen className="h-6 w-6" />
                    <span className="font-bold">Curriculum Analysis</span>
                  </div>
                  <div className="flex items-center gap-3 text-teal-600 bg-teal-50 px-4 py-2 rounded-full">
                    <Bot className="h-6 w-6" />
                    <span className="font-bold">AI Powered</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-col space-y-6">
          {/* Messages Container */}
          <section className="flex-1">
            <div className="space-y-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {/* Welcome State */}
              {messages.length === 0 && (
                <Card className="border-2 border-dashed border-emerald-300 bg-white/60 backdrop-blur-sm hover:border-emerald-400 transition-all duration-300">
                  <CardContent className="p-12">
                    <div className="text-center space-y-8">
                      <div className="flex justify-center">
                        <div className="p-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full">
                          <FileText className="h-24 w-24 text-emerald-600" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-3xl font-bold text-gray-800">Ready to Analyze Your Curriculum</h3>
                        <p className="text-gray-600 text-xl leading-relaxed max-w-2xl mx-auto">
                          Upload your curriculum PDF and start asking questions to get detailed and helpful answers!
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300">
                          <h4 className="font-bold text-emerald-800 mb-3 text-lg">Content Questions</h4>
                          <p className="text-emerald-700">Ask about any topic in the curriculum</p>
                        </div>
                        <div className="p-6 bg-teal-50 rounded-2xl border-2 border-teal-200 hover:border-teal-400 transition-all duration-300">
                          <h4 className="font-bold text-teal-800 mb-3 text-lg">Concept Explanations</h4>
                          <p className="text-teal-700">Get simplified explanations of concepts</p>
                        </div>
                        <div className="p-6 bg-cyan-50 rounded-2xl border-2 border-cyan-200 hover:border-cyan-400 transition-all duration-300">
                          <h4 className="font-bold text-cyan-800 mb-3 text-lg">Practice Questions</h4>
                          <p className="text-cyan-700">Request practice exam questions</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Messages */}
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-4 duration-500`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card
                    className={`max-w-[85%] shadow-xl border-0 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                        : "bg-white/95 backdrop-blur-sm border border-gray-200"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-full flex-shrink-0 ${
                            message.role === "user"
                              ? "bg-white/20 text-white"
                              : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                          }`}
                        >
                          {message.role === "user" ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          {message.parts.map((part, partIndex) => {
                            if (part.type === "text") {
                              return (
                                <div
                                  key={`${message.id}-text-${partIndex}`}
                                  className={`whitespace-pre-wrap leading-relaxed text-lg ${
                                    message.role === "user" ? "text-white" : "text-gray-800"
                                  }`}
                                >
                                  {part.text}
                                </div>
                              )
                            }
                            if (part.type === "file" && part.mediaType === "application/pdf") {
                              return (
                                <div key={`${message.id}-pdf-${partIndex}`} className="mt-4">
                                  <div
                                    className={`flex items-center gap-3 p-4 rounded-xl ${
                                      message.role === "user"
                                        ? "bg-white/20 text-white"
                                        : "bg-gradient-to-r from-red-50 to-pink-50 border border-red-200"
                                    }`}
                                  >
                                    <FileText className="h-6 w-6 text-red-500" />
                                    <span className="text-base font-medium truncate">{part.filename}</span>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-start">
                  <Card className="max-w-[85%] shadow-xl border-0 bg-white/95 backdrop-blur-sm border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                          <Bot className="h-6 w-6" />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex space-x-1">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
                            <div
                              className="w-3 h-3 bg-teal-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-gray-700 text-lg font-medium">Analyzing curriculum...</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </section>

          {/* Input Form Section */}
          <section className="sticky bottom-0 z-10">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* File Upload Area */}
                  <div className="flex items-center justify-between gap-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-400 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="application/pdf"
                        onChange={(event) => {
                          if (event.target.files) {
                            setFiles(event.target.files)
                          }
                        }}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-3 bg-white hover:bg-emerald-50 border-emerald-300 hover:border-emerald-500 text-emerald-700 font-bold px-8 py-4 rounded-xl transition-all duration-300 text-lg"
                      >
                        <Upload className="h-6 w-6" />
                        Choose Curriculum PDF
                      </Button>
                    </div>

                    <div className="flex-1 text-center">
                      {files && files.length > 0 ? (
                        <div className="flex items-center justify-center gap-3 text-base bg-green-100 text-green-800 px-6 py-3 rounded-xl border border-green-300">
                          <FileText className="h-6 w-6" />
                          <span className="font-bold">{files[0].name}</span>
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      ) : (
                        <span className="text-gray-600 text-lg">No file selected</span>
                      )}
                    </div>
                  </div>

                  {/* Message Input Area */}
                  <div className="flex gap-4">
                    <Input
                      value={input}
                      placeholder="Ask about any topic in the curriculum... e.g., Explain the math lesson in chapter 3"
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 h-16 px-6 text-lg border-2 border-gray-300 focus:border-emerald-500 rounded-2xl bg-white/90 backdrop-blur-sm transition-all duration-300 placeholder:text-gray-500"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || (!input.trim() && (!files || files.length === 0))}
                      className="h-16 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Send className="h-6 w-6" />
                          <span>Send</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
