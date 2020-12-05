const goodResponse = (res, msg) => {
    return res.status(200).send({
      isError: false,
      result: msg,
    });
  };
  const badResponse = (res, msg) => {
    return res.status(400).send({
      isError: true,
      result: msg,
    });
  };

  
  exports.goodResponse = goodResponse;
  exports.badResponse= badResponse;