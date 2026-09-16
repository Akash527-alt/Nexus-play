import express from "express";
import {
  getMySponsorProfile,
  updateSponsorProfile,
  sponsorTournament,
  getMySponsorships,
  getTournamentSponsors,
  getOrganizerSponsors,
  updateSponsorshipStatus,
  getAllSponsors,
} from "../controller/sponsorController.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Public / General Sponsors List
router.route("/").get(getAllSponsors);

// Sponsor Profile Routes
router
  .route("/me")
  .get(
    isAuthenticatedUser,
    authorizeRoles("sponsor", "admin", "superadmin"),
    getMySponsorProfile
  )
  .put(
    isAuthenticatedUser,
    authorizeRoles("sponsor", "admin", "superadmin"),
    updateSponsorProfile
  );

// Sponsor submitted deals
router
  .route("/sponsorships")
  .get(
    isAuthenticatedUser,
    authorizeRoles("sponsor", "admin", "superadmin"),
    getMySponsorships
  );

// Tournament Sponsorship Action
router
  .route("/tournaments/:id/sponsors")
  .post(
    isAuthenticatedUser,
    authorizeRoles("sponsor", "admin", "superadmin"),
    sponsorTournament
  )
  .get(getTournamentSponsors);

// Organizer sponsorship oversight
router
  .route("/organizer/sponsors")
  .get(
    isAuthenticatedUser,
    authorizeRoles("organizer", "admin", "superadmin"),
    getOrganizerSponsors
  );

router
  .route("/organizer/sponsors/:id/status")
  .patch(
    isAuthenticatedUser,
    authorizeRoles("organizer", "admin", "superadmin"),
    updateSponsorshipStatus
  );

export default router;
