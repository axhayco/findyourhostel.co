import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Bot, X, Send, Sparkles, Loader2, AlertTriangle, Check } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  pendingConfirm?: ConfirmAction;
}

interface ConfirmAction {
  label: string;
  detail: string;
  onConfirm: () => void;
}

// ─── System Prompt Builder ────────────────────────────────────────────────────

function buildSystemPrompt(role: "student" | "owner") {
  const identity = `
You are the HostelMate Digital Assistant — a built-in assistant for HostelMate, a hostel management platform in Hyderabad, India.

IDENTITY RULES (non-negotiable):
- NEVER say "I am an AI", "I'm a language model", "As an AI", or anything that reveals you are an AI.
- NEVER say "I don't have access to real data" or "I cannot look up". Play the role fully.
- You ARE the hostel's digital system. Say "I've checked your records", "I can process that."
- Tone: friendly, concise, campus-native Indian English. Numbers in ₹ rupees.
- Keep responses SHORT — 1-3 sentences unless listing data.
- Never use markdown formatting like ** or ## in responses.

MISSING PARAMETER PROTOCOL:
- If user triggers an action but is missing required info, ask for ONE missing field at a time.
- Never ask for all fields at once. Never execute until all required fields are collected.
- Remember all context within the conversation.

HIGH-IMPACT CONFIRMATION RULE:
- Before executing: payments, broadcasts, leave rejection — summarize and say "Shall I proceed?"
- Wait for explicit yes/confirm before acting.
- If cancelled, say "Got it, cancelled." and stop.

ESCALATION:
- If confused after 2 turns, say "Let me connect you to the hostel team directly" and end with: https://wa.me/919999999999
`.trim();

  const studentContext = `
PERSONA: Student resident at HostelMate hostel.

SKILLS YOU HANDLE:
1. CheckElectricityBalance — requires: roomNumber
2. GetMessMenu — requires: day, mealType
3. RequestLeave — requires: startDate, endDate, reason
4. RateMessMeal — requires: mealType, rating (1-5), optional feedback

SIMULATED LIVE DATA (present this as real):
- Electricity: Room 304: ₹145 (~2 days left). Room 102: ₹520 (~8 days left).
- Today's lunch: Rajma Chawal, Roti, Mix Veg. Today's dinner: Paneer Butter Masala with Naan.
- Tomorrow's breakfast: Idli Sambar. Tomorrow's lunch: Chicken Curry, Rice, Dal.
- Leave requests: pending state, generate ticket IDs like LV-2847.
- Mess rating average this week: 3.8/5.
`.trim();

  const ownerContext = `
PERSONA: Hostel Owner / Administrator.

SKILLS YOU HANDLE:
1. CheckOccupancyStats — optional: hostelId
2. BroadcastNotice — requires: message, urgency (Low/Normal/High/Critical), target
3. ApproveLeave — requires: leaveId or student name, decision (Approved/Rejected), optional comments
4. GetPendingLeaves — no params needed

SIMULATED LIVE DATA (present this as real):
- Occupancy: 85% across 3 properties, 12 vacant beds. Monthly revenue: ~₹2,45,000.
- Pending leaves: John Doe Room 102 (Oct 12-15), Priya Sharma Room 204 (Oct 14-16), Arjun Reddy Room 310 (Oct 13-14).
- Last broadcast: "Water supply disruption 9-11am" sent 2 days ago to all 120 residents.

CONFIRMATION REQUIRED FOR: Any BroadcastNotice, any leave Rejection, payment actions.
`.trim();

  return `${identity}\n\n${role === "student" ? studentContext : ownerContext}`;
}

// ─── Claude API Call ──────────────────────────────────────────────────────────

async function callClaude(
  messages: { role: "user" | "assistant"; content: string }[],
  systemPrompt: string
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  });
  if (!response.ok) throw new Error(`API ${response.status}`);
  const data = await response.json();
  return data.content?.[0]?.text ?? "I couldn't process that. Please try again.";
}

// ─── Confirm Card ─────────────────────────────────────────────────────────────

function ConfirmCard({ action, onConfirm, onCancel }: {
  action: ConfirmAction;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mt-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 space-y-2 w-full">
      <div className="flex items-center gap-1.5">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Confirm Action</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Check className="h-3 w-3" /> Proceed
        </button>
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border border-border bg-card py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const AgentControlPlane = () => {
  const { user, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activePendingId, setActivePendingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  // Greeting on open
  useEffect(() => {
    if (isOpen && messages.length === 0 && role) {
      const greeting =
        role === "owner"
          ? "Welcome back. Ask me about occupancy stats, pending leaves, or to broadcast a notice."
          : "Hey! Ask me about your electricity balance, today's mess menu, or to submit a leave request.";
      setMessages([{ id: "init", role: "assistant", content: greeting }]);
    }
  }, [isOpen, role, messages.length]);

  if (!user || !role) return null;

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: text.trim() };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setInputText("");
    setIsLoading(true);
    setActivePendingId(null);

    try {
      const history = nextMsgs.map((m) => ({ role: m.role, content: m.content }));
      const reply = await callClaude(history, buildSystemPrompt(role as "student" | "owner"));

      const needsConfirm = /shall I proceed|please confirm|should I proceed|confirm this/i.test(reply);
      const assistantId = `a-${Date.now()}`;

      if (needsConfirm) {
        const confirmAction: ConfirmAction = {
          label: "High-impact action",
          detail: reply,
          onConfirm: async () => {
            setActivePendingId(null);
            const confirmUserMsg: Message = { id: `u-${Date.now()}`, role: "user", content: "Confirmed, please proceed." };
            const withConfirm = [...nextMsgs, { id: assistantId, role: "assistant" as const, content: reply }, confirmUserMsg];
            setMessages(withConfirm);
            setIsLoading(true);
            try {
              const finalReply = await callClaude(
                withConfirm.map((m) => ({ role: m.role, content: m.content })),
                buildSystemPrompt(role as "student" | "owner")
              );
              setMessages((p) => [...p, { id: `a-${Date.now()}`, role: "assistant", content: finalReply }]);
            } catch {
              setMessages((p) => [...p, { id: `a-${Date.now()}`, role: "assistant", content: "Something went wrong. Please try again." }]);
            } finally {
              setIsLoading(false);
            }
          },
        };
        setMessages((p) => [...p, { id: assistantId, role: "assistant", content: reply, pendingConfirm: confirmAction }]);
        setActivePendingId(assistantId);
      } else {
        setMessages((p) => [...p, { id: assistantId, role: "assistant", content: reply }]);
      }
    } catch {
      setMessages((p) => [...p, { id: `a-${Date.now()}`, role: "assistant", content: "I'm having trouble connecting. Try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setActivePendingId(null);
    setMessages((p) => [...p, { id: `a-${Date.now()}`, role: "assistant", content: "Got it, cancelled. Anything else I can help with?" }]);
  };

  const quickActions =
    role === "student"
      ? ["Electricity balance", "Today's mess menu", "Request leave"]
      : ["Occupancy stats", "Pending leaves", "Broadcast a notice"];

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
        aria-label="Open HostelMate Assistant"
      >
        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
        <Bot className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 z-50 flex h-[85vh] w-full flex-col overflow-hidden border border-border bg-card shadow-2xl sm:bottom-5 sm:right-5 sm:h-[600px] sm:w-[380px] sm:rounded-2xl animate-in slide-in-from-bottom-8 duration-300">

          {/* Header */}
          <div className="flex shrink-0 items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">HostelMate Assistant</p>
                <p className="flex items-center gap-1 text-[10px] opacity-80">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                  </span>
                  Always Active
                </p>
              </div>
            </div>
            <button
              onClick={() => { setIsOpen(false); setMessages([]); setActivePendingId(null); }}
              className="rounded-full p-2 transition-colors hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-background/50 p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex max-w-[88%] flex-col ${
                  msg.role === "user" ? "ml-auto items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm border border-border bg-card text-foreground"
                  }`}
                >
                  {msg.content}
                </div>

                {msg.pendingConfirm && activePendingId === msg.id && (
                  <div className="w-full">
                    <ConfirmCard
                      action={msg.pendingConfirm}
                      onConfirm={msg.pendingConfirm.onConfirm}
                      onCancel={handleCancel}
                    />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex max-w-[88%] items-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}

            {/* Quick actions — only show at start */}
            {messages.length === 1 && !isLoading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => sendMessage(action)}
                    className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-border bg-card p-3">
            <div className="flex items-center gap-2 rounded-full border border-input bg-background px-4 py-2 shadow-sm transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask anything..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) sendMessage(inputText); }}
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {isLoading
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Send className="h-3.5 w-3.5 -ml-px" />
                }
              </button>
            </div>
            <p className="mt-1.5 text-center text-[9px] text-muted-foreground">HostelMate Digital Assistant</p>
          </div>
        </div>
      )}
    </>
  );
};