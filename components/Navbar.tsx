import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="shadow-lg w-full p-4 top-0 bg-green-300">
      <div className="container mx-auto flex flex-wrap justify-center md:justify-between items-center gap-3 ">
        {/* Call Agent Button */}
        <a href="tel:+919366794921">
          <button className="px-6 py-2 font-semibold rounded-lg hover:scale-[1.07] transition border-2 border-black bg-green-700 text-white">
            Call agent
          </button>
        </a>

        {/* WhatsApp Button */}
        <a href="https://wa.me/916009936047" target="_blank" rel="noopener noreferrer">
          <button className="px-6 py-2 font-semibold rounded-lg hover:scale-[1.07] transition border-2 border-black bg-green-700 text-white">
            WhatsApp
          </button>
        </a>

        {/* Admin Button */}
        {/* <Link href="/winners">
          <button className="px-6 py-2 font-semibold rounded-lg hover:scale-[1.07] transition border-2 border-black bg-green-700 text-white">
            Winners of previous game
          </button>
        </Link> */}
        <Link href="/admin">
          <button className="px-6 py-2 font-semibold rounded-lg hover:scale-[1.07] transition border-2 border-black bg-green-700 text-white">
            Admin
          </button>
        </Link>
      </div>
    </nav>
  );
}
