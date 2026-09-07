// import * as dotenv from "dotenv";
import { PrismaClient } from '../generated/prisma/client'

// dotenv.config({path: ['.env.local', '.env']})

const prisma = new PrismaClient()
export { prisma }
