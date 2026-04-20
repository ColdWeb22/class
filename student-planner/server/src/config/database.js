const { Sequelize } = require('sequelize');
const path = require('path');
const dns = require('dns');

let sequelize;

if (typeof dns.setDefaultResultOrder === 'function') {
    // Render/Supabase can return AAAA first; prefer IPv4 to avoid ENETUNREACH on hosts without IPv6 egress.
    dns.setDefaultResultOrder(process.env.DNS_RESULT_ORDER || 'ipv4first');
}

const normalizeDatabaseUrl = (rawUrl) => {
    if (!rawUrl) return '';

    const trimmed = rawUrl.trim();
    if (
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
        return trimmed.slice(1, -1);
    }

    return trimmed;
};

const buildPostgresConnection = (rawUrl) => {
    const databaseUrl = normalizeDatabaseUrl(rawUrl);

    let parsed;
    try {
        parsed = new URL(databaseUrl);
    } catch (error) {
        throw new Error('DATABASE_URL is not a valid URL. Paste the full connection string from your DB provider.');
    }

    if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) {
        throw new Error('DATABASE_URL must start with postgres:// or postgresql://');
    }

    const username = decodeURIComponent(parsed.username || '');
    const host = parsed.hostname;

    if (!host) {
        throw new Error('DATABASE_URL is missing a database host.');
    }

    if (!username) {
        throw new Error('DATABASE_URL is missing a database username.');
    }

    if (username.includes(' ')) {
        throw new Error('DATABASE_URL username contains spaces. Re-copy the URL from your provider dashboard.');
    }

    if (username.includes('/')) {
        throw new Error('DATABASE_URL username contains "/" which is invalid for Postgres usernames.');
    }

    const sslEnabled = process.env.DB_SSL !== 'false';

    return new Sequelize(databaseUrl, {
        dialect: 'postgres',
        dialectOptions: sslEnabled
            ? {
                  ssl: {
                      require: true,
                      rejectUnauthorized: false,
                  },
              }
            : {},
        logging: false,
    });
};

// For Render/production with PostgreSQL
if (process.env.DATABASE_URL) {
    sequelize = buildPostgresConnection(process.env.DATABASE_URL);
} 
// For MySQL
else if (process.env.DB_DIALECT === 'mysql') {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            logging: false,
        }
    );
} 
// Default to SQLite for local development
else {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../database.sqlite'),
        logging: false,
    });
}

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        const dialect = sequelize.getDialect();
        console.log(`Database connected (${dialect})`);
        await sequelize.sync({ alter: true }); // Sync models
    } catch (error) {
        console.error('Unable to connect to the database:', error.message || error);
        if (error.parent?.message) {
            console.error('Database driver error:', error.parent.message);
        }

        if (
            error.original?.code === 'ENETUNREACH' ||
            error.parent?.code === 'ENETUNREACH' ||
            error.code === 'ENETUNREACH'
        ) {
            console.error('Network unreachable for DB host (likely IPv6 route issue).');
            console.error('Set NODE_OPTIONS=--dns-result-order=ipv4first and use an IPv4-reachable DB hostname.');
        }

        if (process.env.NODE_ENV === 'production') {
            console.error('FATAL: Database connection failed in production. Check DATABASE_URL on Render and redeploy.');
            process.exit(1);
        }
    }
};

module.exports = { sequelize, connectDB };
