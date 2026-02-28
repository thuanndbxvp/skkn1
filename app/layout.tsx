import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam-pro',
})

export const metadata: Metadata = {
  title: 'SKKN Pro - Viết Sáng Kiến Kinh Nghiệm Thông Minh',
  description:
    'Trợ lý AI giúp giáo viên viết Sáng kiến kinh nghiệm tự động, tiết kiệm 90% thời gian. Đúng mẫu, chuyên nghiệp, dễ sử dụng.',
  keywords:
    'sáng kiến kinh nghiệm, SKKN, giáo viên, AI, viết tự động, giáo dục',
  authors: [{ name: 'Trần Hoài Thanh' }],
  openGraph: {
    title: 'SKKN Pro - Viết Sáng Kiến Kinh Nghiệm Thông Minh',
    description: 'Trợ lý AI giúp giáo viên viết SKKN tự động, tiết kiệm 90% thời gian',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className={beVietnamPro.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#363636',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
