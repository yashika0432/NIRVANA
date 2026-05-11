import PredictionForm from "./components/PredictionForm";

export default function App() {
  return (
    <div
      className="min-h-screen text-white p-6 md:p-10"
      style={{ background: "transparent" }}
    >
      <header className="text-center mb-10">
        <h1
          className="font-display text-7xl md:text-8xl font-semibold tracking-[0.3em] text-white leading-none mb-3"
          style={{
            fontFamily: "'Playfair Display', serif",
            textShadow: "0 2px 24px rgba(0,0,0,0.18)",
            color: "black",
          }}
        >
          NIRVANA
        </h1>
        <p
          className="text-base tracking-[0.18em] uppercase mt-2"
          style={{
            color: "rgba(255,255,255,0.6)",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
          }}
        >
          mental pattern intelligence
        </p>
      </header>
      <PredictionForm />
    </div>
  );
}
