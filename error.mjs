const errorController = (err, req, res, next) => {
  console.log(err);

  if (err.isManual) {
    res.statusCode = res.statusCode;
    res.json({ error: err.message });
  } else {
    res.statusCode = 500;
    res.json({ error: "something is not ok" });
  }
};

const undefinedRouteHandler = (req, res) => {
  res.json({ message: "wrong route" });
};

class ServerError extends Error {
  constructor(statusCode, errorMassage) {
    super(errorMassage);
    this.statusCode = statusCode;
    this.isManual = true;
  }
}

export { errorController, undefinedRouteHandler, ServerError };
