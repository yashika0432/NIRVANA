import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ResultCard from "./ResultCard";
import { useNirvanaModel } from "../hooks/useNirvanaModel";

const TRIGGERS = [
  "Work Pressure",
  "Social Anxiety",
  "Sleep Deprivation",
  "Conflict",
  "Relationship Issues",
  "Overthinking",
];

const DEFAULT_LOG = () => ({
  id: Date.now() + Math.random(),
  sleep: 7,
  stress: 5,
  anxiety: 5,
  caffeine: 2,
  mood: 6,
  trigger: "Work Pressure",
  journal: "",
  date: new Date().toISOString().split("T")[0],
});

/* ── Shared style tokens (mirrors the glass card CSS) ───── */
const glass = {
  background: "rgba(195, 220, 205, 0.38)",
  border: "1px solid rgba(255,255,255,0.52)",
  backdropFilter: "blur(22px) saturate(160%)",
  WebkitBackdropFilter: "blur(22px) saturate(160%)",
  boxShadow:
    "0 8px 32px rgba(80,120,100,0.18), 0 2px 8px rgba(80,120,100,0.10), inset 0 1px 0 rgba(255,255,255,0.6)",
};

const inputStyle = {
  background: "rgba(255,255,255,0.55)",
  border: "1px solid rgba(255,255,255,0.7)",
  borderRadius: "50px",
  padding: "10px 16px",
  width: "100%",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "14px",
  color: "#1a1a2e",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  backdropFilter: "blur(8px)",
};

const labelStyle = {
  fontSize: "11px",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#4a6b5a",
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 500,
  marginBottom: "6px",
  display: "block",
};

function SliderField({ label, name, min, max, step = 1, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(name, +e.target.value)}
          className="slider flex-1"
          style={{ accentColor: "#3d6b52" }}
        />
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#2a4a38",
            minWidth: "28px",
            textAlign: "right",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function LogEntry({ log, index, total, onChange, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      style={{
        background: "rgba(210, 230, 215, 0.32)",
        border: "1px solid rgba(255,255,255,0.45)",
        borderRadius: "20px",
        padding: "24px",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Entry header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "16px",
            fontWeight: 500,
            color: "#1a3a28",
            fontStyle: "italic",
            margin: 0,
          }}
        >
          Day {index + 1} — Daily Log
        </h3>
        {total > 1 && (
          <button
            onClick={() => onRemove(log.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(80,100,90,0.5)",
              fontSize: "18px",
              lineHeight: 1,
              transition: "color 0.15s",
              padding: "2px 6px",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#c0392b")}
            onMouseLeave={(e) => (e.target.style.color = "rgba(80,100,90,0.5)")}
          >
            ✕
          </button>
        )}
      </div>

      {/* Sliders grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        <SliderField
          label="Sleep Hours"
          name="sleep"
          min={1}
          max={12}
          step={0.5}
          value={log.sleep}
          onChange={(k, v) => onChange(log.id, k, v)}
        />
        <SliderField
          label="Stress Level (1–10)"
          name="stress"
          min={1}
          max={10}
          value={log.stress}
          onChange={(k, v) => onChange(log.id, k, v)}
        />
        <SliderField
          label="Anxiety Level (1–10)"
          name="anxiety"
          min={1}
          max={10}
          value={log.anxiety}
          onChange={(k, v) => onChange(log.id, k, v)}
        />
        <SliderField
          label="Caffeine Intake (cups)"
          name="caffeine"
          min={0}
          max={7}
          value={log.caffeine}
          onChange={(k, v) => onChange(log.id, k, v)}
        />
        <SliderField
          label="Mood Score (1–10)"
          name="mood"
          min={1}
          max={10}
          value={log.mood}
          onChange={(k, v) => onChange(log.id, k, v)}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={labelStyle}>Log Date</label>

          <input
            type="date"
            value={log.date}
            onChange={(e) => onChange(log.id, "date", e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Trigger select */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={labelStyle}>Primary Trigger</label>
          <select
            value={log.trigger}
            onChange={(e) => onChange(log.id, "trigger", e.target.value)}
            style={{
              ...inputStyle,
              borderRadius: "50px",
              cursor: "pointer",
              appearance: "none",
              paddingRight: "36px",
            }}
          >
            {TRIGGERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Journal */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <label style={labelStyle}>Journal — how did you feel today?</label>
        <textarea
          rows={3}
          value={log.journal}
          onChange={(e) => onChange(log.id, "journal", e.target.value)}
          placeholder="Write freely…"
          style={{
            ...inputStyle,
            borderRadius: "16px",
            resize: "vertical",
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function PredictionForm() {
  const [logs, setLogs] = useState([DEFAULT_LOG()]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { status, predict } = useNirvanaModel();

  const addLog = () => setLogs((prev) => [...prev, DEFAULT_LOG()]);
  const removeLog = (id) => setLogs((prev) => prev.filter((l) => l.id !== id));
  const updateLog = (id, key, value) =>
    setLogs((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [key]: value } : l)),
    );

  const handleAnalyse = async () => {
    setLoading(true);
    try {
      const prediction = await predict(logs);
      localStorage.setItem("nirvana_logs", JSON.stringify(logs));
      setResult({ ...prediction, logCount: logs.length });
    } catch (e) {
      console.error("Prediction failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      {/* Main glass card */}
      <div
        style={{
          ...glass,
          borderRadius: "28px",
          padding: "clamp(24px, 4vw, 40px)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "28px",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(22px, 3vw, 28px)",
                fontWeight: 600,
                color: "#1a3a28",
                margin: "0 0 4px",
              }}
            >
              Emotional Logs
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "#4a6b5a",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              Add multiple days to improve prediction accuracy
            </p>
          </div>

          <button
            onClick={addLog}
            style={{
              background: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(255,255,255,0.7)",
              borderRadius: "50px",
              padding: "10px 20px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "#2a4a38",
              cursor: "pointer",
              transition: "all 0.2s",
              backdropFilter: "blur(8px)",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.65)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.45)")
            }
          >
            + Add Log
          </button>
        </div>

        {/* Log entries */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxHeight: "600px",
            overflowY: "auto",
            paddingRight: "4px",
          }}
        >
          <AnimatePresence mode="popLayout">
            {logs.map((log, i) => (
              <LogEntry
                key={log.id}
                log={log}
                index={i}
                total={logs.length}
                onChange={updateLog}
                onRemove={removeLog}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Analyse button */}
        <button
          onClick={handleAnalyse}
          disabled={loading || status === "training"}
          style={{
            marginTop: "28px",
            width: "100%",
            background: "#1a3a28",
            color: "#ffffff",
            border: "none",
            borderRadius: "50px",
            padding: "16px 32px",
            fontFamily: "'Playfair Display', serif",
            fontSize: "16px",
            fontWeight: 500,
            letterSpacing: "0.08em",
            cursor:
              loading || status === "training" ? "not-allowed" : "pointer",
            opacity: loading || status === "training" ? 0.55 : 1,
            transition: "all 0.2s",
            boxShadow: "0 4px 20px rgba(26,58,40,0.28)",
          }}
          onMouseEnter={(e) => {
            if (!loading && status !== "training") {
              e.currentTarget.style.background = "#2a5a40";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 6px 24px rgba(26,58,40,0.36)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1a3a28";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(26,58,40,0.28)";
          }}
        >
          {loading ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <svg
                className="animate-spin"
                style={{ width: "18px", height: "18px" }}
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Analysing…
            </span>
          ) : status === "training" ? (
            "Training model…"
          ) : (
            "Analyse Mental Pattern"
          )}
        </button>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ResultCard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
