"use client"

import type React from "react"
import { useRef, useState } from "react"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Send, FileText, Bot, User, BookOpen, GraduationCap } from "lucide-react"
import ReactMarkdown from "react-markdown"

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
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, isLoading } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    if (!input.trim() && (!files || files.length === 0)) return

    // تحقق من حجم الملف (الحد الأقصى 10MB)
    if (files && files.length > 0) {
      const file = files[0]
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        setError("حجم الملف كبير جداً! الحد الأقصى هو 10 ميجابايت")
        return
      }
    }

    try {
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
    } catch (error) {
      console.error("خطأ في إرسال الرسالة:", error)
      setError("حدث خطأ في إرسال الرسالة. تأكد من حجم الملف وحاول مرة أخرى.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100" dir="rtl">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header Section */}
        <header className="mb-10">
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg">
            <CardHeader className="text-center py-16">
              <div className="flex flex-col items-center space-y-8">
                <div className="p-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-2xl">
                  <GraduationCap className="h-20 w-20 text-white" />
                </div>

                <CardTitle className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  مساعد المناهج الذكي
                </CardTitle>

                <p className="text-gray-700 text-2xl font-medium max-w-3xl leading-relaxed">
                  ارفع ملف PDF الخاص بالمنهج واسأل أسئلة ذكية حول محتواه التعليمي
                </p>

                <div className="flex items-center justify-center gap-12 mt-10">
                  <div className="flex items-center gap-4 text-emerald-600 bg-emerald-50 px-6 py-3 rounded-full border-2 border-emerald-200">
                    <BookOpen className="h-7 w-7" />
                    <span className="font-bold text-lg">تحليل المناهج</span>
                  </div>
                  <div className="flex items-center gap-4 text-teal-600 bg-teal-50 px-6 py-3 rounded-full border-2 border-teal-200">
                    <Bot className="h-7 w-7" />
                    <span className="font-bold text-lg">ذكاء اصطناعي</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-col space-y-8">
          {/* Messages Container */}
          <section className="flex-1">
            <div className="space-y-8 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {/* Welcome State */}
              {messages.length === 0 && (
                <Card className="border-2 border-dashed border-emerald-300 bg-white/70 backdrop-blur-sm hover:border-emerald-400 transition-all duration-300">
                  <CardContent className="p-16">
                    <div className="text-center space-y-10">
                      <div className="flex justify-center">
                        <div className="p-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full">
                          <FileText className="h-28 w-28 text-emerald-600" />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-4xl font-bold text-gray-800">جاهز لتحليل منهجك</h3>
                        <p className="text-gray-600 text-2xl leading-relaxed max-w-3xl mx-auto">
                          ارفع ملف PDF الخاص بالمنهج الدراسي وابدأ بطرح الأسئلة للحصول على إجابات مفصلة ومفيدة!
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        <div className="p-8 bg-emerald-50 rounded-3xl border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-300">
                          <h4 className="font-bold text-emerald-800 mb-4 text-xl">أسئلة المحتوى</h4>
                          <p className="text-emerald-700 text-lg">اسأل عن أي موضوع في المنهج</p>
                        </div>
                        <div className="p-8 bg-teal-50 rounded-3xl border-2 border-teal-200 hover:border-teal-400 hover:shadow-lg transition-all duration-300">
                          <h4 className="font-bold text-teal-800 mb-4 text-xl">شرح المفاهيم</h4>
                          <p className="text-teal-700 text-lg">احصل على شرح مبسط للمفاهيم</p>
                        </div>
                        <div className="p-8 bg-cyan-50 rounded-3xl border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-lg transition-all duration-300">
                          <h4 className="font-bold text-cyan-800 mb-4 text-xl">أسئلة الامتحان</h4>
                          <p className="text-cyan-700 text-lg">اطلب أسئلة تدريبية</p>
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
                  className={`flex ${message.role === "user" ? "justify-start" : "justify-end"} animate-in slide-in-from-bottom-4 duration-500`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card
                    className={`max-w-[80%] shadow-xl border-0 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                        : "bg-white/95 backdrop-blur-sm border border-gray-200"
                    }`}
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start gap-5">
                        <div
                          className={`p-4 rounded-full flex-shrink-0 ${
                            message.role === "user"
                              ? "bg-white/20 text-white"
                              : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                          }`}
                        >
                          {message.role === "user" ? <User className="h-7 w-7" /> : <Bot className="h-7 w-7" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          {message.parts.map((part, partIndex) => {
                            if (part.type === "text") {
                              return (
                                <div
                                  key={`${message.id}-text-${partIndex}`}
                                  className={`prose prose-lg max-w-none leading-relaxed ${
                                    message.role === "user"
                                      ? "text-white prose-headings:text-white prose-strong:text-white prose-em:text-white prose-code:text-white prose-pre:bg-white/10 prose-pre:text-white"
                                      : "text-gray-800 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-em:text-gray-700 prose-code:bg-gray-100 prose-code:text-gray-800 prose-pre:bg-gray-50"
                                  }`}
                                >
                                  {message.role === "user" ? (
                                    <div className="text-xl whitespace-pre-wrap">{part.text}</div>
                                  ) : (
                                    <ReactMarkdown
                                      className="text-xl"
                                      components={{
                                        h1: ({ children }) => (
                                          <h1 className="text-3xl font-bold mb-6 text-emerald-700 border-b-2 border-emerald-200 pb-3">
                                            {children}
                                          </h1>
                                        ),
                                        h2: ({ children }) => (
                                          <h2 className="text-2xl font-bold mb-4 text-teal-700 mt-8">{children}</h2>
                                        ),
                                        h3: ({ children }) => (
                                          <h3 className="text-xl font-bold mb-3 text-cyan-700 mt-6">{children}</h3>
                                        ),
                                        p: ({ children }) => (
                                          <p className="mb-4 leading-relaxed text-lg text-gray-800">{children}</p>
                                        ),
                                        ul: ({ children }) => (
                                          <ul className="list-disc list-inside mb-4 space-y-2 text-lg mr-6">
                                            {children}
                                          </ul>
                                        ),
                                        ol: ({ children }) => (
                                          <ol className="list-decimal list-inside mb-4 space-y-2 text-lg mr-6">
                                            {children}
                                          </ol>
                                        ),
                                        li: ({ children }) => (
                                          <li className="mb-2 text-gray-800 leading-relaxed">{children}</li>
                                        ),
                                        strong: ({ children }) => (
                                          <strong className="font-bold text-emerald-800 bg-emerald-50 px-1 rounded">
                                            {children}
                                          </strong>
                                        ),
                                        em: ({ children }) => (
                                          <em className="italic text-teal-700 bg-teal-50 px-1 rounded">{children}</em>
                                        ),
                                        code: ({ children }) => (
                                          <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-base font-mono border">
                                            {children}
                                          </code>
                                        ),
                                        pre: ({ children }) => (
                                          <pre className="bg-gray-50 p-4 rounded-xl overflow-x-auto border-2 border-gray-200 mb-4">
                                            {children}
                                          </pre>
                                        ),
                                        blockquote: ({ children }) => (
                                          <blockquote className="border-r-4 border-emerald-400 bg-emerald-50 p-4 my-4 rounded-r-lg">
                                            <div className="text-emerald-800">{children}</div>
                                          </blockquote>
                                        ),
                                        table: ({ children }) => (
                                          <div className="overflow-x-auto mb-4">
                                            <table className="min-w-full border-collapse border border-gray-300 rounded-lg">
                                              {children}
                                            </table>
                                          </div>
                                        ),
                                        th: ({ children }) => (
                                          <th className="border border-gray-300 bg-emerald-100 px-4 py-3 text-right font-bold text-emerald-800">
                                            {children}
                                          </th>
                                        ),
                                        td: ({ children }) => (
                                          <td className="border border-gray-300 px-4 py-3 text-right">{children}</td>
                                        ),
                                      }}
                                    >
                                      {part.text}
                                    </ReactMarkdown>
                                  )}
                                </div>
                              )
                            }
                            if (part.type === "file" && part.mediaType === "application/pdf") {
                              return (
                                <div key={`${message.id}-pdf-${partIndex}`} className="mt-5">
                                  <div
                                    className={`flex items-center gap-4 p-5 rounded-xl ${
                                      message.role === "user"
                                        ? "bg-white/20 text-white"
                                        : "bg-gradient-to-r from-red-50 to-pink-50 border border-red-200"
                                    }`}
                                  >
                                    <FileText className="h-7 w-7 text-red-500" />
                                    <span className="text-lg font-medium truncate">{part.filename}</span>
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
                <div className="flex justify-end">
                  <Card className="max-w-[80%] shadow-xl border-0 bg-white/95 backdrop-blur-sm border border-gray-200">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-5">
                        <div className="p-4 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                          <Bot className="h-7 w-7" />
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex gap-2">
                            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce"></div>
                            <div
                              className="w-4 h-4 bg-teal-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-4 h-4 bg-cyan-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-gray-700 text-xl font-medium">جاري تحليل المنهج...</span>
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
              <CardContent className="p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* File Upload Area */}
                  <div className="flex items-center gap-8 p-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl border-2 border-dashed border-emerald-300 hover:border-emerald-400 transition-all duration-300">
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
                      className="flex items-center gap-4 bg-white hover:bg-emerald-50 border-emerald-300 hover:border-emerald-500 text-emerald-700 font-bold px-10 py-5 rounded-2xl transition-all duration-300 text-xl"
                    >
                      <Upload className="h-7 w-7" />
                      اختر ملف المنهج
                    </Button>

                    <div className="flex-1 text-center">
                      {files && files.length > 0 ? (
                        <div className="flex items-center justify-center gap-4 text-lg bg-green-100 text-green-800 px-8 py-4 rounded-2xl border border-green-300">
                          <FileText className="h-7 w-7" />
                          <div className="flex flex-col items-center">
                            <span className="font-bold">{files[0].name}</span>
                            <span className="text-sm text-green-600">
                              {(files[0].size / (1024 * 1024)).toFixed(2)} ميجابايت
                            </span>
                          </div>
                          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      ) : (
                        <span className="text-gray-600 text-xl">لم يتم اختيار ملف</span>
                      )}
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
                      <div className="flex items-center gap-3 text-red-700">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">!</span>
                        </div>
                        <span className="text-lg font-medium">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Message Input Area */}
                  <div className="flex gap-6">
                    <Input
                      value={input}
                      placeholder="اسأل عن أي موضوع في المنهج... مثل: اشرح لي درس الرياضيات في الفصل الثالث"
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 h-20 px-8 text-xl border-2 border-gray-300 focus:border-emerald-500 rounded-3xl bg-white/90 backdrop-blur-sm transition-all duration-300 placeholder:text-gray-500"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || (!input.trim() && (!files || files.length === 0))}
                      className="h-20 px-10 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xl"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-4">
                          <div className="w-7 h-7 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>جاري الإرسال...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <Send className="h-7 w-7" />
                          <span>إرسال</span>
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
