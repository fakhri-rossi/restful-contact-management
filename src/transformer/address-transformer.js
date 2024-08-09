const addressTransformer = (address) => {
  return {
    _id: address._id,
    street: address.street,
    city: address.city,
    province: address.province,
    country: address.country,
    postal_code: address.postal_code,
  };
};

export default addressTransformer;
