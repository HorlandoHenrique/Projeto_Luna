import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { z } from "zod";
import { prisma } from "../db.js";
import { config } from "../config.js";
import { ensureRelationship } from "../services/relationship.service.js";

const signupSchema = z.object({
  displayName: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(120),
  password: z.string().min(8).max(120),
  ageConfirmed: z.boolean().default(false),
  termsAccepted: z.boolean().default(false),
  newsAccepted: z.boolean().default(false)
});

const loginSchema = z.object({
  email: z.string().trim().email().max(120),
  password: z.string().min(8).max(120)
});

const googleSchema = z.object({
  credential: z.string().min(20)
});

const guestSchema = z.object({
  displayName: z.string().trim().min(2).max(60).optional().default("Visitante")
});

function publicUser(user) {
  return {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    authProvider: user.authProvider
  };
}

function signSession(fastify, user) {
  return fastify.jwt.sign({
    sub: user.id,
    displayName: user.displayName
  });
}

async function ensureDefaultConversation(userId) {
  const existing = await prisma.conversation.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" }
  });

  if (existing) {
    return existing;
  }

  return prisma.conversation.create({
    data: { userId }
  });
}

async function finishAuth(fastify, user) {
  await ensureRelationship(prisma, user.id);
  await ensureDefaultConversation(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastSeenAt: new Date() }
  });

  return {
    token: signSession(fastify, user),
    user: publicUser(user)
  };
}

export default async function authRoutes(fastify) {
  fastify.post("/guest", async (request) => {
    const parsed = guestSchema.safeParse(request.body || {});
    const user = await prisma.user.create({
      data: {
        displayName: parsed.success ? parsed.data.displayName : "Visitante",
        authProvider: "guest"
      }
    });

    return finishAuth(fastify, user);
  });

  fastify.post("/signup", async (request, reply) => {
    const parsed = signupSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(400).send({ error: "invalid_signup", details: parsed.error.flatten() });
    }

    const data = parsed.data;

    if (!data.ageConfirmed || !data.termsAccepted) {
      return reply.code(400).send({
        error: "missing_consent",
        message: "Confirme maioridade e termos para criar a conta."
      });
    }

    const email = data.email.toLocaleLowerCase("pt-BR");
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return reply.code(409).send({
        error: "email_in_use",
        message: "Este e-mail ja esta cadastrado."
      });
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        displayName: data.displayName,
        email,
        passwordHash,
        authProvider: "site",
        ageConfirmed: data.ageConfirmed,
        termsAccepted: data.termsAccepted,
        newsAccepted: data.newsAccepted
      }
    });

    return finishAuth(fastify, user);
  });

  fastify.post("/login", async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(400).send({ error: "invalid_login", details: parsed.error.flatten() });
    }

    const email = parsed.data.email.toLocaleLowerCase("pt-BR");
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user?.passwordHash) {
      return reply.code(401).send({
        error: "invalid_credentials",
        message: "E-mail ou senha invalidos."
      });
    }

    const passwordOk = await bcrypt.compare(parsed.data.password, user.passwordHash);

    if (!passwordOk) {
      return reply.code(401).send({
        error: "invalid_credentials",
        message: "E-mail ou senha invalidos."
      });
    }

    return finishAuth(fastify, user);
  });

  fastify.post("/google", async (request, reply) => {
    const parsed = googleSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(400).send({ error: "invalid_google_login", details: parsed.error.flatten() });
    }

    if (!config.googleClientId) {
      return reply.code(503).send({
        error: "google_not_configured",
        message: "Configure GOOGLE_CLIENT_ID no backend para ativar login Google real."
      });
    }

    const googleClient = new OAuth2Client(config.googleClientId);
    const ticket = await googleClient.verifyIdToken({
      idToken: parsed.data.credential,
      audience: config.googleClientId
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email) {
      return reply.code(401).send({
        error: "invalid_google_payload",
        message: "Nao foi possivel validar o login Google."
      });
    }

    const email = payload.email.toLocaleLowerCase("pt-BR");
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { googleSub: payload.sub },
          { email }
        ]
      }
    });

    const user = existingUser
      ? await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          googleSub: payload.sub,
          email,
          displayName: payload.name || payload.given_name || existingUser.displayName,
          avatarUrl: payload.picture,
          authProvider: existingUser.authProvider === "site" ? "site_google" : "google"
        }
      })
      : await prisma.user.create({
        data: {
          googleSub: payload.sub,
          email,
          displayName: payload.name || payload.given_name || "Usuario",
          avatarUrl: payload.picture,
          authProvider: "google",
          ageConfirmed: true,
          termsAccepted: true
        }
      });

    return finishAuth(fastify, user);
  });

  fastify.get("/me", { preHandler: [fastify.authenticate] }, async (request) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: request.user.sub }
    });

    return { user: publicUser(user) };
  });
}
