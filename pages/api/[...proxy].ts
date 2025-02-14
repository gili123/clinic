import type { NextApiRequest, NextApiResponse } from 'next'
import httpProxyMiddleware from 'next-http-proxy-middleware'

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await httpProxyMiddleware(req, res, {
      target: 'http://localhost:3001',
      changeOrigin: true,
    }).then((response) => {
      if (response.statusCode === 401) {
        
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
} 