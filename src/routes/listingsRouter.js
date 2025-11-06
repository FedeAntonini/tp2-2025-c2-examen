import express from "express";
import { getAllListings, getListingId, getListingsByPropertyType, getListingsWithTotalPrice, getListingByHost, updateAvailability, getTopHosts } from "../controllers/listingsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", authMiddleware, getAllListings);
router.get("/property-type/:type", authMiddleware, getListingsByPropertyType);
router.get("/host/:host_id", authMiddleware, getListingByHost);
router.get("/with-total-price", authMiddleware, getListingsWithTotalPrice);
router.get("/top-hosts", authMiddleware, getTopHosts);
router.get("/:id", authMiddleware, getListingId);
router.patch("/:id/availability", authMiddleware, updateAvailability);

export default router;
