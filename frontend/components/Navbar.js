import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">My Manager</h1>
        <div className="space-x-4">
          <Link href="/notes" className="hover:text-blue-400">Notes</Link>
          <Link href="/bookmarks" className="hover:text-blue-400">Bookmarks</Link>
        </div>
      </div>
    </nav>
  );
}