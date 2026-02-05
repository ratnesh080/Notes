import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Notes & Bookmarks Manager',
  description: 'Manage your personal data',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-500 min-h-screen text-gray-800">
        <Navbar />
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}