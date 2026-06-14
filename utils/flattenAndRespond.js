const flattenUser = (doc) => {
  const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;

  const { user, ...rest } = obj;

  return {
    ...rest,
    ...user,
  };
};

const flattenAndRespond = (res, { key, data, statusCode = 200 }) => {
  const isArray = Array.isArray(data);

  const flattened = isArray ? data.map(flattenUser) : flattenUser(data);

  res.status(statusCode).json({
    status: "success",

    ...(isArray && {
      length: flattened.length,
    }),

    data: {
      [key]: flattened,
    },
  });
};

export default flattenAndRespond;
