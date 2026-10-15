import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关于我们 - 临港景鸿',
  description: '了解临港景鸿的企业历史、发展历程、团队介绍和企业文化',
}

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-16'>
        <div className='mx-auto max-w-4xl'>
          <h1 className='mb-8 text-center text-4xl font-bold'>关于临港景鸿</h1>

          <div className='mb-8 rounded-lg bg-white p-8 shadow-lg'>
            <h2 className='mb-4 text-2xl font-semibold'>企业简介</h2>
            <p className='mb-6 leading-relaxed text-gray-600'>
              临港景鸿是一家专注于智能化解决方案的高新技术企业，致力于为客户提供
              全方位的智能化产品和服务。我们在人工智能、物联网、大数据等领域拥有
              深厚的技术积累和丰富的项目经验。
            </p>

            <h2 className='mb-4 text-2xl font-semibold'>发展历程</h2>
            <div className='space-y-4'>
              <div className='border-l-4 border-blue-500 pl-4'>
                <h3 className='font-semibold'>2020年</h3>
                <p className='text-gray-600'>公司成立，专注智能化解决方案</p>
              </div>
              <div className='border-l-4 border-blue-500 pl-4'>
                <h3 className='font-semibold'>2021年</h3>
                <p className='text-gray-600'>推出首批智能硬件产品</p>
              </div>
              <div className='border-l-4 border-blue-500 pl-4'>
                <h3 className='font-semibold'>2022年</h3>
                <p className='text-gray-600'>建立完整的产品和服务体系</p>
              </div>
              <div className='border-l-4 border-blue-500 pl-4'>
                <h3 className='font-semibold'>2023年</h3>
                <p className='text-gray-600'>扩大业务范围，服务更多客户</p>
              </div>
              <div className='border-l-4 border-blue-500 pl-4'>
                <h3 className='font-semibold'>2024年</h3>
                <p className='text-gray-600'>持续创新，引领行业发展</p>
              </div>
            </div>
          </div>

          <div className='mb-8 rounded-lg bg-white p-8 shadow-lg'>
            <h2 className='mb-4 text-2xl font-semibold'>企业文化</h2>
            <div className='grid gap-6 md:grid-cols-2'>
              <div>
                <h3 className='mb-2 font-semibold text-blue-600'>使命</h3>
                <p className='text-gray-600'>通过智能化技术，让生活更美好</p>
              </div>
              <div>
                <h3 className='mb-2 font-semibold text-blue-600'>愿景</h3>
                <p className='text-gray-600'>成为智能化解决方案的领导者</p>
              </div>
              <div>
                <h3 className='mb-2 font-semibold text-blue-600'>价值观</h3>
                <p className='text-gray-600'>创新、专业、诚信、共赢</p>
              </div>
              <div>
                <h3 className='mb-2 font-semibold text-blue-600'>理念</h3>
                <p className='text-gray-600'>以客户为中心，以技术为驱动</p>
              </div>
            </div>
          </div>

          <div className='rounded-lg bg-white p-8 shadow-lg'>
            <h2 className='mb-4 text-2xl font-semibold'>联系我们</h2>
            <div className='grid gap-6 md:grid-cols-2'>
              <div>
                <h3 className='mb-2 font-semibold'>公司地址</h3>
                <p className='text-gray-600'>上海市浦东新区临港新片区</p>
              </div>
              <div>
                <h3 className='mb-2 font-semibold'>联系电话</h3>
                <p className='text-gray-600'>400-123-4567</p>
              </div>
              <div>
                <h3 className='mb-2 font-semibold'>邮箱地址</h3>
                <p className='text-gray-600'>info@lgjh.com</p>
              </div>
              <div>
                <h3 className='mb-2 font-semibold'>工作时间</h3>
                <p className='text-gray-600'>周一至周五 9:00-18:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
