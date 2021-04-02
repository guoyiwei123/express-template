import {Request, Response} from "express";
import testModel from "../models/test";
export const test = async(req: Request, res: Response): Promise<void> => {
    testModel.find().then(ctx => {
        console.log(ctx);
        res.status(200).end("111");
    })
}