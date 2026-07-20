import { motion } from "framer-motion";

// The site's signature element: a waveform (Arun's embedded-signal roots)
// that resolves into a small neural-network graph (his AI/ML direction).
// One continuous line tells the "signal → cognition" career story.
export default function SignalSignature({ className = "" }) {
  const wavePath =
    "M0,60 C 40,10 60,10 90,60 C 120,110 140,110 170,60 C 200,10 220,10 250,60 C 280,110 300,110 330,60 C 360,10 380,10 410,60";

  const nodes = [
    { x: 470, y: 30 },
    { x: 470, y: 90 },
    { x: 540, y: 15 },
    { x: 540, y: 60 },
    { x: 540, y: 105 },
    { x: 610, y: 40 },
    { x: 610, y: 80 },
  ];

  const edges = [
    [0, 2], [0, 3], [1, 3], [1, 4],
    [2, 5], [3, 5], [3, 6], [4, 6],
  ];

  return (
    <svg
      viewBox="0 0 650 120"
      className={className}
      fill="none"
      role="img"
      aria-label="Waveform transforming into a neural network, representing the path from embedded signal processing to AI/ML engineering"
    >
      <motion.path
        d={wavePath}
        stroke="url(#waveGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
      <motion.path
        d="M410,60 C 430,60 440,60 460,60"
        stroke="url(#waveGrad)"
        strokeWidth="2"
        strokeDasharray="4 5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      />

      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="#2FB6AA"
          strokeWidth="1.2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 0.5, delay: 1.7 + i * 0.05 }}
        />
      ))}

      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r="5"
          fill="#0B0E14"
          stroke="#4FD1C5"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.9 + i * 0.06, type: "spring" }}
        />
      ))}

      <defs>
        <linearGradient id="waveGrad" x1="0" y1="0" x2="650" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFB454" />
          <stop offset="65%" stopColor="#FFC97A" />
          <stop offset="100%" stopColor="#4FD1C5" />
        </linearGradient>
      </defs>
    </svg>
  );
}
