import { Router } from "express";
import {
  addExpiration,
  deleteURL,
  getAnalytics,
  shortenCustomURL,
  shortenURL,
} from "../controllers/urls.controllers";

const router = Router();

router.route("/shorten").post(shortenURL);
router.route("/custom-shorten").post(shortenCustomURL);
router.route("/expiration/:urlId").patch(addExpiration);
router.route("/analytics/:urlId").get(getAnalytics);
router.route("/:urlId").delete(deleteURL);

export default router;
