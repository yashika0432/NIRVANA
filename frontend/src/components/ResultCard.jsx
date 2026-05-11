export default function ResultCard({ result }) {
  const riskColor =
    result.riskLabel === "High"
      ? "#b94040"
      : result.riskLabel === "Moderate"
        ? "#a07030"
        : "#2a6645";

  return (
    <div
      style={{
        marginTop: "24px",
        background: "rgba(210, 230, 215, 0.42)",
        border: "1px solid rgba(255,255,255,0.55)",
        borderRadius: "20px",
        padding: "28px",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 20px rgba(80,120,100,0.12)",
      }}
    >
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "20px",
          fontWeight: 600,
          color: "#1a3a28",
          margin: "0 0 20px",
          fontStyle: "italic",
        }}
      >
        Prediction Result
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {/* Days pill */}
        <Stat
          label="Expected Attack In"
          value={`${result.days} days`}
          color="#2a6645"
        />
        {/* Trigger pill */}
        <Stat label="Expected Trigger" value={result.trigger} color="#3a5a8a" />
        {/* Risk level */}
        <Stat label="Risk Level" value={result.riskLabel} color={riskColor} />
        {/* Risk score */}
        <Stat
          label="Risk Score"
          value={`${result.riskScore}%`}
          color={riskColor}
        />
        ```jsx
        <Stat
          label="Expected Date"
          value={result.nextAttackDate}
          color="#5c4a8a"
        />
        <Stat
          label="Emotional Trend"
          value={result.emotionalTrend}
          color={result.emotionalTrend === "Escalating" ? "#b94040" : "#2a6645"}
        />
        <Stat
          label="Average Cycle"
          value={`${result.averageCycle} days`}
          color="#3a5a8a"
        />
        <Stat label="Confidence" value={result.confidence} color="#7a5ab8" />
        ```
      </div>

      {/* Recommendation */}
      <div
        style={{
          background: "rgba(255,255,255,0.38)",
          border: "1px solid rgba(255,255,255,0.6)",
          borderRadius: "14px",
          padding: "16px 20px",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#4a6b5a",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            margin: "0 0 6px",
          }}
        >
          Recommendation
        </p>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#1a3a28",
            margin: 0,
          }}
        >
          {result.recommendation}
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.42)",
        border: "1px solid rgba(255,255,255,0.6)",
        borderRadius: "14px",
        padding: "14px 16px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#5a7a68",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          margin: "0 0 6px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "18px",
          fontWeight: 600,
          color,
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
  );
}
