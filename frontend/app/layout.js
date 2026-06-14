import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'XacMinhVanBang - Hệ Thống Xác Minh Văn Bằng Số',
  description: 'Hệ thống xác minh văn bằng số dựa trên công nghệ Blockchain. An toàn, minh bạch và bất biến.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
            },
            success: {
              iconTheme: {
                primary: '#059669',
                secondary: '#ecfdf5',
              },
            },
            error: {
              iconTheme: {
                primary: '#dc2626',
                secondary: '#fef2f2',
              },
            },
          }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
