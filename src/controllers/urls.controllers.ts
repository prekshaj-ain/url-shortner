import { nanoid } from "nanoid";
import { Request, RequestHandler, Response } from "express";
import { HydratedDocument, ObjectId, isValidObjectId } from "mongoose";

import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { URL, IUrl } from "../models/url.model";
import isValidFutureDate from "../utils/IsValidFutureDate";

export const shortenURL: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // get original url
    // generate random short alias
    // check if short alias exists already
    // if yes then generate again
    // if not add to database
    // return the response

    const url: string = req.body.longURL;
    if (url.trim().length == 0) {
      throw new ApiError(400, "original url not defined");
    }
    const MAX_ATTEMPTS = 5; // Maximum attempts to find a unique alias
    let shortAlias: string;
    let attempt = 0;

    while (attempt < MAX_ATTEMPTS) {
      shortAlias = nanoid(6); // Adjust the length as needed
      const existingURL: HydratedDocument<IUrl> | null = await URL.findOne({
        shortAlias,
      });

      if (!existingURL) {
        // Create the new URL
        const newAlias: HydratedDocument<IUrl> = await URL.create({
          longURL: url,
          shortAlias: shortAlias,
        });
        res
          .status(201)
          .json(
            new ApiResponse(
              201,
              { longURL: `${process.env.BASE_URL}/${newAlias.shortAlias}` },
              "Shortened URL successfully created"
            )
          );
      }

      attempt++;
    }
  }
);

export const shortenCustomURL: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const customAlias: string = req.body.customAlias;
    const url: string = req.body.longURL;
    if ([customAlias, url].some((field: string) => field.trim().length == 0)) {
      throw new ApiError(
        400,
        "custom alias and original url both are required"
      );
    }
    // check if customAlias already exist
    const isExisting: HydratedDocument<IUrl> | null = await URL.findOne({
      shortAlias: customAlias,
    });
    if (isExisting) {
      throw new ApiError(403, "Custom alias already taken");
    }
    const newAlias: HydratedDocument<IUrl> = await URL.create({
      shortAlias: customAlias,
      longURL: url,
    });
    console.log(newAlias);
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { longURL: `${process.env.BASE_URL}/${newAlias.shortAlias}` },
          "Shortened URL successfully created"
        )
      );
  }
);

export const addExpiration: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const urlId: string = req.params.urlId;
    if (!isValidObjectId(urlId)) {
      throw new ApiError(400, "urlId is not valid");
    }
    const expirationDate: string = req.body.expirationDate;
    if (expirationDate.trim() == "") {
      throw new ApiError(400, "expiration date is required");
    }
    if (!isValidFutureDate(expirationDate)) {
      throw new ApiError(400, "expiration date should be a future date");
    }
    const doc: HydratedDocument<IUrl> | null = await URL.findByIdAndUpdate(
      urlId,
      {
        $set: {
          expirationDate,
        },
      },
      { new: true }
    );
    if (!doc) {
      throw new ApiError(404, "url not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, doc, "expiration date added successfully"));
  }
);

export const deleteURL: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const urlId: string = req.params.urlId;
    if (!isValidObjectId(urlId)) {
      throw new ApiError(400, "url id is not valid");
    }
    const deletedAlias: HydratedDocument<IUrl> | null =
      await URL.findByIdAndDelete(urlId);
    if (!deletedAlias) {
      throw new ApiError(404, "url not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, deletedAlias, "url deleted successfully"));
  }
);

export const getAnalytics: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const urlId: string = req.params.urlId;
    if (!isValidObjectId(urlId)) {
      throw new ApiError(400, "url id is invalid");
    }
    const doc: HydratedDocument<IUrl> | null = await URL.findById(urlId);
    console.log(doc);
    if (!doc) {
      throw new ApiError(404, "url not found");
    }
    if (doc.expirationDate != undefined && doc.expirationDate <= new Date()) {
      await URL.deleteOne({ _id: doc._id });
      throw new ApiError(400, "url is expired");
    }

    // Convert timestamps to human-readable format
    let clickTimestampsHumanReadable: string[] | null = null;
    if (doc.clickTimestamps) {
      clickTimestampsHumanReadable = doc.clickTimestamps.map(
        (timestamp: Date) => {
          // Assuming timestamps are stored as ISO 8601 strings or Unix timestamps
          return new Date(timestamp).toLocaleString(); // Convert timestamp to human-readable date/time format
        }
      );
    }
    res.status(200).json(
      new ApiResponse(
        200,
        {
          clicks: doc.clicks,
          clickTime: clickTimestampsHumanReadable,
        },
        "analytics fetched successfully"
      )
    );
  }
);

export const redirectURL: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    console.log(req.params);
    const alias: string = req.params.alias;
    if (alias.trim().length == 0) {
      throw new ApiError(400, "alias is required");
    }
    const doc: HydratedDocument<IUrl> | null = await URL.findOne({
      shortAlias: alias,
    });
    if (!doc) {
      throw new ApiError(404, "url not found");
    }
    if (doc.expirationDate != undefined && doc.expirationDate <= new Date()) {
      await URL.deleteOne({ _id: doc._id });
      throw new ApiError(400, "url is expired");
    }
    // Increment clicks count and add click timestamp
    await URL.findByIdAndUpdate(doc._id, {
      $inc: { clicks: 1 },
      $push: { clickTimestamps: new Date() },
    });

    res.redirect(301, doc.longURL);
  }
);
