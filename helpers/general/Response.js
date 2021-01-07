const { model } = require("mongoose");

  // Custom response
     function CustomResponse (res, status, messsage,data){ 

    return res.status(status).json({
        messsage,
        data
    })

 }

  // 200 Ok
  function Ok (res, messsage,data) {
    return res.status(200).json(
        {
            messsage,
            data
        }
    );
  }

  // 201 Ok
  function Created (res, messsage,data)  {
    return res.status(201).json( {
        messsage:messsage||'data created',
        data
    });
  }

  // 204 No Content
  function NoContent(res,messsage){
    return res.status(204).json({
        messsage:messsage||'content not found'
    });
  }

  // 400 Bad request
  function BadRequest (res, messsage,data)  {
    return res.status(400).json({ messsage:messsage||'bad request',data });
  }

  // 401 Unauthorized
  function Unauthorized (res, messsage,data)  {
    return res.status(401).json({ messsage:messsage||'Unauthorized',data });
  }

  // 403 Forbidden
  function Forbidden (res, messsage,data)  {
    return res.status(403).json({  messsage:messsage||'forbidden',data});
  }

  // 404 Not found
  function NotFound (res, messsage,data)  {
    return res.status(404).json({ messsage:messsage||'not found',data });
  }



  // 422 Unprocessable Entity
  function UnprocessableEntity (res, messsage,data)  {
    return res.status(422).json({messsage:messsage||'422 Unprocessable Entity',data });
  }

  // 500 Server error
  function ServerError (res, err, messsage)  {
    console.error(err.message);
    
    return res.status(500).json({ messsage:messsage||'server error we are working to solve it soon'});
  }

  module.exports={

    CustomResponse,
    Ok,
    Created,
    NoContent,
    NotFound,
    BadRequest,
    Unauthorized,
    ServerError,
    UnprocessableEntity,
    Forbidden




  }