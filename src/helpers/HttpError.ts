export default class HttpError extends Error {
  status: any;
  json: any;
  body: any;
  constructor(status, body, json) {
    super(body);
    this.status = status;
    this.json = json;
    this.body = body;
    this.name = this.constructor.name;
    // if (typeof Error.captureStackTrace === 'function') {
    //   Error.captureStackTrace(this, this.constructor);
    // } else {
    //   this.stack = new Error(body).stack;
    // }
    // this.stack = new Error().stack;
  }
}
