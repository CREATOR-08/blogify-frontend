const cards = [
  {
    title: "Grow Your Voice",
    description:
      "Blogging helps you turn your ideas into content that people remember. Share stories, tips and videos to grow your audience.",
  },
  {
    title: "Build Credibility",
    description:
      "A consistent blog shows your expertise and creates trust. Blogging makes it easier for readers to find your work and follow your journey.",
  },
  {
    title: "Create Lasting Impact",
    description:
      "Every published post becomes searchable and shareable. Your insights keep working for you long after you hit publish.",
  },
];

const Advantages = () => {
  return (
    <section className="w-full py-24 bg-slate-950 text-white">
      <h2 className="text-4xl font-bold text-center mb-16 text-cyan-300">
        Advantages of Blogging
      </h2>

      <div className="max-w-6xl mx-auto grid gap-8 px-6 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-lg shadow-black/5 transition hover:-translate-y-2"
          >
            <h3 className="text-2xl font-semibold mb-4">{card.title}</h3>
            <p className="leading-7">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Advantages;