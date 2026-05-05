import { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();
      const botMessage = { role: "bot", content: data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Something went wrong. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>DSA Chatbot ✨</h1>
            <p style={styles.subtitle}>Ask anything about DSA in a modern AI chat experience</p>
          </div>
        </div>

        <div style={styles.chatBox}>
          {messages.length === 0 && (
            <div style={styles.welcomeCard}>
              <h2>Welcome 👋</h2>
              <p>Start by asking about Arrays, Trees, Graphs, DP, Recursion and more.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              style={msg.role === "user" ? styles.userMsg : styles.botMsg}
            >
              {msg.content}
            </div>
          ))}

          {loading && <div style={styles.botMsg}>Thinking...</div>}
        </div>

        <div style={styles.inputArea}>
          <input
            style={styles.input}
            type="text"
            placeholder="Ask me anything about DSA..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button style={styles.button} onClick={sendMessage}>
            Send 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e1b4b, #312e81)",
    padding: "20px",
    fontFamily: "Inter, Arial, sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: "900px",
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },

  header: {
    padding: "24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#ffffff",
  },

  subtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#cbd5e1",
    fontSize: "14px",
  },

  chatBox: {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  welcomeCard: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "20px",
    color: "white",
  },

  userMsg: {
    alignSelf: "flex-end",
    background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
    color: "white",
    padding: "14px 18px",
    borderRadius: "20px 20px 4px 20px",
    maxWidth: "75%",
    fontSize: "15px",
    lineHeight: 1.5,
    boxShadow: "0 10px 30px rgba(99,102,241,0.25)",
  },

  botMsg: {
    alignSelf: "flex-start",
    background: "rgba(255,255,255,0.08)",
    color: "#f8fafc",
    padding: "14px 18px",
    borderRadius: "20px 20px 20px 4px",
    maxWidth: "75%",
    fontSize: "15px",
    lineHeight: 1.5,
    border: "1px solid rgba(255,255,255,0.08)",
  },

  inputArea: {
    display: "flex",
    gap: "12px",
    padding: "20px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
  },

  input: {
    flex: 1,
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    fontSize: "15px",
    outline: "none",
  },

  button: {
    padding: "14px 24px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #a855f7, #6366f1)",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(168,85,247,0.25)",
  },
};

export default App;
