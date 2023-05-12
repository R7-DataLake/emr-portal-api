import fastify from 'fastify';

import path from 'path';

const app = fastify({
  logger: {
    transport:
      process.env.NODE_ENV === 'development'
        ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
            colorize: true
          }
        }
        : undefined
  }
})

// Plugins
app.register(require('@fastify/formbody'))
app.register(require('@fastify/cors'), {
  origin: 'https://r7.moph.go.th',
  methods: ['GET', 'POST'],
})

// Rate limit
const Redis = require('ioredis')
const redis = new Redis({
  connectionName: 'ingress-resis',
  host: process.env.R7PLATFORM_EMR_PORTAL_API_REDIS_RATELIMIT_HOST || 'localhost',
  port: Number(process.env.R7PLATFORM_EMR_PORTAL_API_REDIS_RATELIMIT_PORT) || 6379,
  password: process.env.R7PLATFORM_EMR_PORTAL_API_REDIS_RATELIMIT_PASSWORD || '',
  connectTimeout: 500,
  maxRetriesPerRequest: 1
})

app.register(import('@fastify/rate-limit'), {
  global: true,
  nameSpace: 'r7platform-emr-portal-ratelimit-',
  max: 1000,
  timeWindow: '24h',
  ban: 3,
  keyGenerator: (request: any) => {
    return request.headers['x-real-ip'];
  },
  redis: redis
})

app.register(require('@fastify/static'), {
  root: path.join(__dirname, '../public'),
  prefix: '/',
  // constraints: { host: 'r7.moph.go.th' }
})

app.register(require('@fastify/cookie'), { secret: process.env.R7PLATFORM_EMR_PORTAL_API_COOKIE_SECRET }) // See following section to ensure security
app.register(require('@fastify/csrf-protection'), {
  cookieOpts: { signed: true }
})

// Views
app.register(require("@fastify/view"), {
  engine: {
    ejs: require("ejs"),
  },
});

// Metadata database connection
app.register(require('./plugins/db'), {
  name: 'db',
  options: {
    client: 'pg',
    connection: {
      host: process.env.R7PLATFORM_EMR_PORTAL_API_DB_HOST || 'localhost',
      user: process.env.R7PLATFORM_EMR_PORTAL_API_DB_USER || 'postgres',
      port: Number(process.env.R7PLATFORM_EMR_PORTAL_API_DB_PORT) || 5432,
      password: process.env.R7PLATFORM_EMR_PORTAL_API_DB_PASSWORD || '',
      database: process.env.R7PLATFORM_EMR_PORTAL_API_DB_NAME || 'test',
    },
    searchPath: [process.env.R7PLATFORM_EMR_PORTAL_API_DB_SCHEMA || 'public'],
    pool: {
      min: Number(process.env.R7PLATFORM_EMR_PORTAL_API_DB_POOL_MIN) || 0,
      max: Number(process.env.R7PLATFORM_EMR_PORTAL_API_DB_POOL_MAX) || 10
    },
    debug: process.env.NODE_ENV === "development" ? true : false,
  }
});

// JWT for Login
app.register(require('./plugins/jwt'),
  {
    secret: process.env.R7PLATFORM_EMR_PORTAL_API_SECRET_KEY,
    sign: {
      iss: 'r7platform-emr-api.moph.go.th',
      expiresIn: '1h'
    },
    messages: {
      badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
      noAuthorizationInHeaderMessage: 'Autorization header is missing!',
      authorizationTokenExpiredMessage: 'Authorization token expired',
      authorizationTokenInvalid: (err: any) => {
        return `Authorization token is invalid: ${err.message}`
      }
    }

  });

app.addHook('onSend', (_request: any, reply: any, _playload: any, done: any) => {
  reply.headers({
    'X-Powered-By': 'R7 Health Platform System',
    'X-Processed-By': process.env.R7PLATFORM_EMR_PORTAL_API_HOSTNAME || 'dummy-server',
  })

  done()

});

app.register(require('fastify-axios'), {
  baseURL: process.env.R7PLATFORM_EMR_PORTAL_API_EMR_ENDPOINT || 'http://localhost:3003',
  headers: {
    'Authorization': 'Bearer ' + process.env.R7PLATFORM_EMR_PORTAL_API_EMR_APIKEY
  }
});

app.register(require('fastify-bcrypt'), {
  saltWorkFactor: 12
})

// routes
app.register(require("./routes/status"), { prefix: '/status' })
app.register(require("./routes/emr"), { prefix: '/emr' })
app.register(require("./routes/metadata"), { prefix: '/metadata' })
app.register(require("./routes/register"), { prefix: '/register' })
app.register(require("./routes/profile"), { prefix: '/profile' })
app.register(require("./routes/login"), { prefix: '/login' })
app.register(require("./routes/oauth"), { prefix: '/oauth' })

export default app
