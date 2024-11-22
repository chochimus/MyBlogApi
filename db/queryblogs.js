const prisma = require("./prismaClient");

const queryPublishedPosts = async () => {
  return await prisma.post.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
  });
};

const queryAllPosts = async () => {
  return await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      createdAt: true,
      published: true,
    },
  });
};

const queryPostsById = async (id) => {
  return await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      published: true,
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  });
};

const queryCreatePost = async (data) => {
  return await prisma.post.create({ data });
};

const queryUpdatePost = async (id, data) => {
  return await prisma.post.update({
    data,
    where: {
      id,
    },
  });
};

const queryDeletePost = async (id) => {
  return await prisma.post.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  queryPublishedPosts,
  queryAllPosts,
  queryPostsById,
  queryCreatePost,
  queryDeletePost,
  queryUpdatePost,
};
