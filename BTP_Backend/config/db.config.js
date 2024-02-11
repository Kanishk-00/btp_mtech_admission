module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "kanishk7",
  DB: "Applicants2023",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
