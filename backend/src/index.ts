import express from "express"
import { z } from "zod"
import filesystem from "fs/promises"
import cors from "cors"

const server = express()

server.use(cors())
server.use(express.json())

const UserSchema = z.object({
    id: z.number(),
    email: z.string(),
    createpassword: z.string(),
    confirmpassword: z.string(),
})

const CreateUserSchema = z.object({
    email: z.string(),
    createpassword: z.string(),
    confirmpassword: z.string(),
})

type User = z.infer<typeof UserSchema>

const readFile = async () => {
    try {
        const rawData = await filesystem.readFile(`${__dirname}/../database.json`, "utf-8")
        const countries: User[] = JSON.parse(rawData)
        return countries
    } catch (error) {
        return null
    }
}

server.post("/api/users", async (req, res) => {

    const result = CreateUserSchema.safeParse(req.body)
    if (!result.success)
        return res.status(400).json(result.error.issues)

    const users = await readFile();
    if (!users)
        return res.sendStatus(500)

    const randomID = Math.random()
    users.push({ ...result.data, id: randomID })

    await filesystem.writeFile(`${__dirname}/../database.json`, JSON.stringify(users, null, 2))
    res.json({ id: randomID })
})


server.listen(4003)