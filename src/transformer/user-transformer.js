export default userTransformer = (user) => {
  return {
    name: user.name,
    username: user.username,
  };
};
