import { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";

const TRIGGERS = [
  "Work Pressure",
  "Social Anxiety",
  "Sleep Deprivation",
  "Conflict",
  "Relationship Issues",
  "Overthinking",
];

// Generate synthetic training data that mirrors the Python sklearn model's
// feature relationships: sleep↓ risk↑, stress/anxiety↑ risk↑, mood↑ risk↓
function generateSyntheticData(n = 2000) {
  const X = [],
    yDays = [],
    yRisk = [];

  for (let i = 0; i < n; i++) {
    const sleep = Math.random() * 10 + 2;
    const stress = Math.random() * 9 + 1;
    const anxiety = Math.random() * 9 + 1;
    const caffeine = Math.random() * 7;
    const mood = Math.random() * 9 + 1;
    const trig = Math.floor(Math.random() * 6);

    const rawDays =
      20 -
      stress * 0.9 -
      anxiety * 0.8 +
      sleep * 0.7 +
      mood * 0.4 -
      caffeine * 0.3 +
      trig * 0.5 +
      (Math.random() * 4 - 2);

    const days = Math.max(1, rawDays);
    const risk = (stress * 0.4 + anxiety * 0.4 + (10 - sleep) * 0.2) / 10;

    // Normalise inputs to [0,1]
    X.push([
      sleep / 12,
      stress / 10,
      anxiety / 10,
      caffeine / 7,
      mood / 10,
      trig / 5,
    ]);
    yDays.push(days / 20);
    yRisk.push(Math.min(1, Math.max(0, risk)));
  }

  return { X, yDays, yRisk };
}

async function buildAndTrainModel() {
  const { X, yDays, yRisk } = generateSyntheticData(2000);

  const xs = tf.tensor2d(X);
  const ys = tf.stack([tf.tensor1d(yDays), tf.tensor1d(yRisk)], 1);

  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [6], units: 64, activation: "relu" }),
      tf.layers.dropout({ rate: 0.1 }),
      tf.layers.dense({ units: 32, activation: "relu" }),
      tf.layers.dense({ units: 2, activation: "sigmoid" }),
    ],
  });

  model.compile({
    optimizer: tf.train.adam(0.002),
    loss: "meanSquaredError",
  });

  await model.fit(xs, ys, {
    epochs: 40,
    batchSize: 64,
    shuffle: true,
    verbose: 0,
  });

  xs.dispose();
  ys.dispose();

  return model;
}

export function useNirvanaModel() {
  const [status, setStatus] = useState("training"); // "training" | "ready" | "error"
  const modelRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("training");

    buildAndTrainModel()
      .then((m) => {
        if (!cancelled) {
          modelRef.current = m;
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      modelRef.current?.dispose();
    };
  }, []);

  async function predict(logs) {
    const avg = (key) =>
      logs.reduce((s, l) => s + Number(l[key]), 0) / logs.length;

    // -----------------------------
    // Emotional averages
    // -----------------------------

    const sleep = avg("sleep");
    const stress = avg("stress");
    const anxiety = avg("anxiety");
    const caffeine = avg("caffeine");
    const mood = avg("mood");

    // -----------------------------
    // Trigger frequency prediction
    // -----------------------------

    const triggerCounts = {};

    logs.forEach((l) => {
      triggerCounts[l.trigger] = (triggerCounts[l.trigger] || 0) + 1;
    });

    const trigger = Object.keys(triggerCounts).reduce((a, b) =>
      triggerCounts[a] > triggerCounts[b] ? a : b,
    );

    const trigIdx = Math.max(0, TRIGGERS.indexOf(trigger));

    // -----------------------------
    // Timeline analysis
    // -----------------------------

    const sortedLogs = [...logs].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    let avgGap = 7;

    if (sortedLogs.length > 1) {
      const gaps = [];

      for (let i = 1; i < sortedLogs.length; i++) {
        const prev = new Date(sortedLogs[i - 1].date);
        const curr = new Date(sortedLogs[i].date);

        const diff = Math.abs(curr - prev) / (1000 * 60 * 60 * 24);

        gaps.push(diff);
      }

      avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    }

    // -----------------------------
    // Emotional trend detection
    // -----------------------------

    const recentLogs = sortedLogs.slice(-3);

    const recentStress =
      recentLogs.reduce((s, l) => s + Number(l.stress), 0) / recentLogs.length;

    const recentAnxiety =
      recentLogs.reduce((s, l) => s + Number(l.anxiety), 0) / recentLogs.length;

    const emotionalTrend =
      recentStress + recentAnxiety > stress + anxiety ? "Escalating" : "Stable";

    // -----------------------------
    // TensorFlow prediction
    // -----------------------------

    const inp = [
      sleep / 12,
      stress / 10,
      anxiety / 10,
      caffeine / 7,
      mood / 10,
      trigIdx / 5,
    ];

    let days, riskScore;

    if (modelRef.current) {
      const tensor = tf.tensor2d([inp]);

      const pred = modelRef.current.predict(tensor);

      const vals = await pred.data();

      tensor.dispose();
      pred.dispose();

      days = Math.round(vals[0] * 20 * 10) / 10;

      riskScore = Math.round(vals[1] * 100);
    } else {
      days = Math.max(
        1,
        Math.round(
          (20 - stress * 0.9 - anxiety * 0.8 + sleep * 0.7 + mood * 0.4) * 10,
        ) / 10,
      );

      riskScore = Math.round(
        Math.min(100, (stress * 0.4 + anxiety * 0.4 + (10 - sleep) * 0.2) * 10),
      );
    }

    // -----------------------------
    // Time cycle adjustment
    // -----------------------------

    days = Math.round(days * 0.7 + avgGap * 0.3);

    days = Math.max(1, Math.min(30, days));

    riskScore = Math.max(5, Math.min(99, riskScore));

    // -----------------------------
    // Next attack date prediction
    // -----------------------------

    const today = new Date();

    const nextAttackDate = new Date();

    nextAttackDate.setDate(today.getDate() + days);

    // -----------------------------
    // Risk label
    // -----------------------------

    let riskLabel;
    let recommendation;

    if (riskScore >= 70) {
      riskLabel = "High";

      recommendation =
        "Immediate stress relief is recommended. Reduce caffeine, improve sleep consistency, and avoid known triggers.";
    } else if (riskScore >= 45) {
      riskLabel = "Moderate";

      recommendation =
        "Monitor emotional changes carefully and maintain calming routines.";
    } else {
      riskLabel = "Low";

      recommendation = "Your recent patterns appear emotionally stable.";
    }

    return {
      days,
      riskScore,
      riskLabel,
      trigger,
      recommendation,

      emotionalTrend,

      averageCycle: Math.round(avgGap * 10) / 10,

      nextAttackDate: nextAttackDate.toDateString(),

      confidence: `${Math.min(96, 75 + logs.length * 3)}%`,
    };
  }

  return { status, predict };
}
