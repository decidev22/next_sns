import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

/*This function will prevent Next13 hotreload to creating bunch of new PrismaClients.
This is also better practice than creating bunch of import {PrismaClient} in codebase...!*/
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV != "production") globalThis.prisma = client;

export default client;
