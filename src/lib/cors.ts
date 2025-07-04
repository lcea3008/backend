import { NextRequest, NextResponse } from "next/server"

export function withCors(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const response = await handler(req)

    response.headers.set("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.set("Access-Control-Allow-Credentials", "true")

    return response
  }
}

export function handleOptions(req: NextRequest) {
  const res = new NextResponse(null, { status: 204 })
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:5173")
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.headers.set("Access-Control-Allow-Credentials", "true")
  return res
}
