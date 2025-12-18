const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

// For Render/production with PostgreSQL
if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false,
    });
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
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectDB };
