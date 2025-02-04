import { Knex } from "knex";
import { Request, Response } from "express";
import { app } from "../../main";
import { IncomingMessage, Server, ServerResponse } from "http";
import User from "models/user.model";

type DBEnv = {
  development: Knex.Config;
  production: Knex.Config;
  testing: Knex.Config;
};

interface Env {
  [key: string]: SN | undefined;
  APP_ENV?: "development" | "production" | "testing";
  APP_PORT?: number;
}

type AppInstance = typeof app;
type ServerInstance = Server<typeof IncomingMessage, typeof ServerResponse>;

interface IReq extends Request {
  user: User;
  locals: any;
  files: {
    [x: string]: any;
  };
}
interface IRes extends Response {
  locals: {
    user: User;
  };
}
