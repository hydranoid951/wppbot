import express from "express";
import cors from "cors";
import qrcode from "qrcode-terminal";
import axios from "axios";
import {
  Buttons,
  Contact,
  List,
  Location,
  MessageMedia,
  Poll,
  Client,
} from "whatsapp-web.js";
import { config } from "dotenv";

config();

const { PORT, HOSTNAME, WEBHOOK_URL } = process.env;
const client = new Client({});

const app = express();

app.use(
  cors({
    origin: [`${HOSTNAME}:${PORT}`],
  })
);

app.get("/", async (req, res) => {
  console.log(req.query);

  const { chatId, message } = req.query as {
    chatId: string;
    message: string;
  };

  if (!chatId) {
    return res.send("No chat id provided");
  }

  // /* LOCATION */
  // const locationMessage = new Location(37.7749, -122.4194, {
  //   name: "San Francisco",
  // });
  // client.sendMessage(chatId, locationMessage);

  // /* CONTATO - OFF */
  // const contactMessage: Contact = {
  //   number: "553584019871",
  //   /** Indicates if the contact is a business contact */
  //   isBusiness: false,
  //   type: "a",
  //   /** ID that represents the contact */
  //   id: {
  //     server: "string",
  //     user: "string",
  //     _serialized: "string",
  //   },
  //   /** Indicates if the contact is an enterprise contact */
  //   isEnterprise: false,
  //   /** Indicates if the contact is a group contact */
  //   isGroup: false,
  //   /** Indicates if the contact is the current user's contact */
  //   isMe: false,
  //   /** Indicates if the number is saved in the current phone's contacts */
  //   isMyContact: true,
  //   /** Indicates if the contact is a user contact */
  //   isUser: true,
  //   /** Indicates if the number is registered on WhatsApp */
  //   isWAContact: true,
  //   /** Indicates if you have blocked this contact */
  //   isBlocked: false,
  //   /** The name that the contact has configured to be shown publically */
  //   pushname: "Luks",
  //   /** @todo missing documentation */
  //   sectionHeader: "string",
  //   statusMute: false,
  // };
  // client.sendMessage(chatId, contactMessage);

  // /* BUTTON - OFF */
  // const buttonsMsg = new Buttons("Aperte 1", [
  //   { body: "Button 1" },
  //   { body: "Button 2" },
  // ]);
  // client.sendMessage(chatId, buttonsMsg);

  // /* LIST  */
  // const listMessage = new List("Escolha uma opção", "Qual desses é melhor?", [
  //   {
  //     title: "Opção 1",
  //     description: "Descrição da opção 1",
  //     action: {
  //       url: "https://www.google.com",
  //       text: "Acessar",
  //     },
  //     rows: [
  //       { title: "azul", description: "a cor do ceu" },
  //       { title: "vermelho", description: "a cor do sangue" },
  //       { title: "verde", description: "a cor dos campos" },
  //     ],
  //   },
  //   {
  //     title: "Opção 2",
  //     description: "Descrição da opção 2",
  //     action: {
  //       url: "https://www.amazon.com",
  //       text: "Abrir",
  //     },
  //     rows: [
  //       { title: "oi", description: "como vai" },
  //       { title: "voce é quem", description: "me diga quem eres" },
  //       { title: "onde vc mora", description: "passa me o teu endereço" },
  //     ],
  //   },
  // ]);
  // client.sendMessage(chatId, listMessage);

  // /* MEDIA */
  // // const media = MessageMedia.fromFilePath("./cacto.jpg");
  // const media = await MessageMedia.fromUrl(
  //   "https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png"
  // );
  // client.sendMessage(chatId, media, { caption: "olha isso q maneiro" });

  // /* POLL - OFF */
  // const pollMessage = {
  //   pollName: "Qual é o seu sabor de pizza favorito?",
  //   pollOptions: [
  //     { name: "Marguerita", localId: 0 },
  //     { name: "Pepperoni", localId: 1 },
  //     { name: "Havaiana", localId: 2 },
  //     { name: "Quatro queijos", localId: 3 },
  //   ],
  //   options: {
  //     allowMultipleAnswers: true,
  //   },
  // } as Poll;
  // client.sendMessage(chatId, pollMessage);

  /* TEXT */
  client.sendMessage(chatId, message);
  res.send(`mensagem enviada ${chatId}`);
});

app.use((req, res) => {
  res.status(404);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso ${HOSTNAME}:${PORT}`);

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.on("message", (msg) => {
    try {
      console.log("message received: ", msg.body);
      const chatOd = msg.from;
      axios.get(`${WEBHOOK_URL}?chatId=${chatOd}&msg=${msg.body}`);
    } catch (e) {
      console.log("1");
      console.log(e);
    }
  });

  client.on("message_create", (msg) => {
    try {
      console.log("message sent: ", msg.body);
      if (msg.body === "oi") {
        const chatId = msg.from;
        axios.get(`${WEBHOOK_URL}?chatId=${chatId}&msg=${msg.body}`);
      }
    } catch (e) {
      console.log(e);
    }
  });

  client.initialize();
});

export default app;
