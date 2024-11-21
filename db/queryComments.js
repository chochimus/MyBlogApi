const prisma = require("./prismaClient");

const queryCreateComment = async (data) => {
  return await prisma.comment.create({ data });
};

const queryCommentAuthor = async (id) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
    select: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  return comment?.user || null;
};

const queryDeleteComment = async (id) => {
  return await prisma.comment.delete({
    where: {
      id,
    },
  });
};

module.exports = { queryCreateComment, queryCommentAuthor, queryDeleteComment };
