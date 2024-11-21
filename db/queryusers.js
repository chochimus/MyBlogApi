const prisma = require("./prismaClient");

const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      role: true,
    },
  });
};

const getUserByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: {
      username,
    },
  });
};

const createUser = async (username, password) => {
  return await prisma.user.create({
    data: {
      username,
      password,
    },
  });
};

module.exports = {
  getUserById,
  getUserByUsername,
  createUser,
};
