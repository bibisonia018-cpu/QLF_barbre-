import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for booking
  app.post("/api/book", async (req, res) => {
    const { name, phone, services, total, isHomeService, locationLink } = req.body;

    if (!name || !phone || !services || services.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram credentials missing");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const message = `
🆕 *Nouvelle Réservation - QLF Barber*
👤 *Client:* ${name}
📞 *Téléphone:* ${phone}
🏠 *Type:* ${isHomeService ? "📍 À DOMICILE" : "💈 AU SALON"}
✂️ *Services:* ${services.join(", ")}
💰 *Total:* ${total} DA
${isHomeService && locationLink ? `📍 *Localisation:* ${locationLink}` : ""}
    `;

    try {
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send Telegram message");
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error sending Telegram message:", error);
      res.status(500).json({ error: "Failed to process booking" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
