const contactTransformer = (contact) => {
  return {
    _id: contact._id,
    first_name: contact.first_name,
    last_name: contact.last_name,
    email: contact.email,
    phone: contact.phone,
  };
};

export default contactTransformer;
