import { Link } from "react-router";
import { presentations } from "../data/presentations";
import { Navbar } from "../components/Navbar";
import { User } from "lucide-react";

export function Presenters() {
  const uniquePresenters = Array.from(
    new Map(
      presentations.map((p) => [
        p.presenter,
        {
          name: p.presenter,
          image: p.presenterImage,
          presentationCount: presentations.filter((pres) => pres.presenter === p.presenter).length,
        },
      ])
    ).values()
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Our Presenters
            </h1>
            <p className="text-xl text-white/60">
              Meet the talented individuals sharing their knowledge and expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {uniquePresenters.map((presenter) => (
              <Link
                key={presenter.name}
                to={`/presenter/${encodeURIComponent(presenter.name)}`}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-yellow-500/50 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <img
                      src={presenter.image}
                      alt={presenter.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white/10 group-hover:border-yellow-500/50 transition-colors"
                    />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-500 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center">
                      <User className="w-5 h-5 text-black" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors ">
                    {presenter.name}
                  </h3>
                  <p className="text-sm text-white/60">
                    {presenter.presentationCount} {presenter.presentationCount === 1 ? 'Presentation' : 'Presentations'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
