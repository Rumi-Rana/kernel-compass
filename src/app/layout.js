import './globals.css'
import { Providers } from './Providers'
import ThemeProvider from './ThemeProvider'
import BirthdayToast from '../components/layout/BirthdayToast'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export const metadata = {
  title: 'Kernel Compass',
  description: 'Educational blog and community for students and families abroad',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
        <ThemeProvider>
          <Providers>
            <div className="relative z-10">
              <Navbar />
              <BirthdayToast />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}