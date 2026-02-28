import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Sparkles,
  Clock,
  FileText,
  Target,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SKKN Pro</h1>
                <p className="text-xs text-gray-600">Powered by AI</p>
              </div>
            </div>
            <Link href="/skkn">
              <Button size="lg" className="hidden sm:flex">
                Bắt đầu ngay
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">
              Trợ lý AI thông minh cho giáo viên Việt Nam
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Viết Sáng Kiến Kinh Nghiệm
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Nhanh Gấp 10 Lần
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Từ việc mất hàng tuần loay hoay, giờ đây chỉ cần vài giờ. AI viết
            theo đúng mẫu của sở, đúng chuẩn Bộ GD&ĐT, giúp thầy cô tập trung
            vào giảng dạy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/skkn">
              <Button size="lg" className="text-lg px-8 py-6 w-full sm:w-auto">
                <Sparkles className="w-5 h-5 mr-2" />
                Bắt đầu viết SKKN
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 w-full sm:w-auto"
              disabled
            >
              📹 Xem video hướng dẫn (Sắp có)
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <p className="text-4xl font-bold text-blue-600">90%</p>
              <p className="text-sm text-gray-600 mt-1">Tiết kiệm thời gian</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600">1,200+</p>
              <p className="text-sm text-gray-600 mt-1">Giáo viên tin dùng</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-orange-600">100%</p>
              <p className="text-sm text-gray-600 mt-1">Đúng chuẩn BGD</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tại sao chọn SKKN Pro?
          </h2>
          <p className="text-lg text-gray-600">
            6 tính năng vượt trội giúp thầy cô viết SKKN dễ dàng hơn bao giờ hết
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <FileText className="w-8 h-8" />,
              title: 'Tải lên mẫu của sở',
              description:
                'AI tự động phân tích cấu trúc mẫu SKKN của trường/sở, viết đúng format yêu cầu',
              color: 'blue',
            },
            {
              icon: <Clock className="w-8 h-8" />,
              title: 'Tiết kiệm 90% thời gian',
              description:
                'Từ 1-2 tuần giảm còn vài giờ. Tập trung vào giảng dạy thay vì viết báo cáo',
              color: 'green',
            },
            {
              icon: <Target className="w-8 h-8" />,
              title: 'Bám sát chuẩn BGD',
              description:
                'Nội dung học thuật, có số liệu cụ thể, phù hợp với yêu cầu Bộ GD&ĐT',
              color: 'orange',
            },
            {
              icon: <Sparkles className="w-8 h-8" />,
              title: 'AI viết chuyên nghiệp',
              description:
                'Văn phong khoa học, logic mạch lạc, có ví dụ thực tế từ lớp học',
              color: 'purple',
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: 'Dễ sử dụng cho mọi người',
              description:
                'Giao diện đơn giản, hướng dẫn rõ ràng. Ai cũng làm được, kể cả người không rành công nghệ',
              color: 'pink',
            },
            {
              icon: <Award className="w-8 h-8" />,
              title: 'Xuất file Word ngay',
              description:
                'Download file .docx đúng format A4, font Times New Roman, sẵn sàng nộp',
              color: 'indigo',
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 bg-${feature.color}-100 rounded-lg flex items-center justify-center text-${feature.color}-600 mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Quy trình 6 bước đơn giản
          </h2>
          <p className="text-lg text-gray-600">
            Từ ý tưởng đến SKKN hoàn chỉnh chỉ trong vài giờ
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {[
            {
              step: '1',
              title: 'Tải lên mẫu SKKN',
              description: 'Upload file Word hoặc chọn mẫu có sẵn của Bộ GD&ĐT',
            },
            {
              step: '2',
              title: 'AI phân tích cấu trúc',
              description: 'Tự động nhận diện các phần, mục cần viết',
            },
            {
              step: '3',
              title: 'Điền thông tin đề tài',
              description: 'Nhập tên đề tài, môn học, đối tượng nghiên cứu...',
            },
            {
              step: '4',
              title: 'AI lập dàn ý chi tiết',
              description: 'Tạo outline hoàn chỉnh, logic, mạch lạc',
            },
            {
              step: '5',
              title: 'AI viết từng phần',
              description: 'Viết nội dung chuyên nghiệp, có số liệu cụ thể',
            },
            {
              step: '6',
              title: 'Xuất file Word',
              description: 'Download file .docx hoàn chỉnh, sẵn sàng nộp',
            },
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                {item.step}
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Lợi ích khi sử dụng SKKN Pro
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Tiết kiệm đến 90% thời gian viết SKKN',
                'Bám sát mẫu yêu cầu từng địa phương',
                'Nội dung trình bày chuyên nghiệp, học thuật',
                'Giảm áp lực khi sắp hết deadline',
                'Phù hợp với giáo viên mọi cấp học',
                'Có số liệu, ví dụ thực tế cụ thể',
                'Xuất file Word đúng format ngay lập tức',
                'Dễ chỉnh sửa, bổ sung sau khi AI viết',
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                  <p className="text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng viết SKKN thông minh?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Tham gia cùng hơn 1,200 giáo viên đang tiết kiệm thời gian với SKKN Pro
          </p>
          <Link href="/skkn">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Bắt đầu viết SKKN ngay
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              <strong>SKKN Pro</strong> - Trợ lý AI cho giáo viên Việt Nam
            </p>
            <p className="text-sm">
              Phát triển bởi{' '}
              <a
                href="https://www.facebook.com/deshunvn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Nguyễn Đức Thuận
              </a>{' '}
              © 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
