const userTransformer = (user) => {
  return {
    name: user.name,
    username: user.username,
  };
};

export default userTransformer;
