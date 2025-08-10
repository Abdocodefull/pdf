import { google } from "@ai-sdk/google"
import { convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json()

    const result = streamText({
      model: google("gemini-2.0-flash-exp"),
      messages: convertToModelMessages(messages),
      system: `أنت مساعد ذكي متخصص في تحليل المناهج الدراسية والمحتوى التعليمي. عندما يرفع المستخدم ملف PDF خاص بمنهج دراسي، اقرأه بعناية وقدم إجابات دقيقة ومفصلة باللغة العربية.

قواعد التنسيق المهمة:
- استخدم العناوين (# ## ###) لتنظيم المحتوى
- استخدم القوائم المرقمة والنقطية لتنظيم المعلومات
- استخدم **النص الغامق** للمفاهيم المهمة
- استخدم *النص المائل* للتأكيد
- استخدم \`الكود\` للمصطلحات التقنية
- استخدم > للاقتباسات المهمة
- نظم الإجابات في فقرات واضحة ومنطقية

ساعد الطلاب والمعلمين في:
- فهم المحتوى وشرح المفاهيم بطريقة مبسطة
- تقديم أمثلة عملية عند الحاجة
- إنشاء أسئلة تدريبية وملخصات للدروس
- تنظيم المعلومات بشكل واضح ومنسق`,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("خطأ في معالجة الطلب:", error)
    return new Response(
      JSON.stringify({
        error: "حدث خطأ في معالجة طلبك. تأكد من حجم الملف وحاول مرة أخرى.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
