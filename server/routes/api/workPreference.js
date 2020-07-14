const router = require('express').Router();

const WorkPreference = require('../../models/WorkPreference');



/**
 * @swagger
 * path:
 *  /api/workPreference/add:
 *    post:
 *      summary: Create a new work preference for current user in the DB.
 *      tags: [Status]
 *      parameters:
 *        - in: body
 *          name: office
 *          description: User's preference in which office they intend to be in.
 *          schema:
 *            type: string
 *        - in: body
 *          name: user
 *          description: Current active user (autopopulated).
 *          schema:
 *            $ref: '#/components/schemas/User'
 *      produces:
 *       - application/json
 *      responses:
 *        200:
 *          description: Current user's latest work preference.
 *        500:
 *          description: Server error.
 */
router.post("/add", function (req, res) {
  var wp = new WorkPreference({
    office: req.body.office,
    user: req.user
  });
  wp.save(async function (err, savedWP) {
    if (!err) return res.json(savedWP);
    else return res.status(500).send(err);
  });
});


/**
 * @swagger
 * path:
 *  /api/status/get-current:
 *    get:
 *      summary: Get the latest status for the current user.
 *      tags: [Status]
 *      produces:
 *       - application/json
 *      responses:
 *        200:
 *          description: Current user's latest status.
 *        500:
 *          description: Server error.
 */
router.get("/get-latest", function (req, res) {
  WorkPreference.find({
      "user": req.user._id
    }).sort({
      createdAt: -1
    }).limit(1)
    .exec(function (err, statuses) {
      if (statuses == null) res.json(null);
      if (!err) return res.json(statuses[0]);
      else return res.status(500).send(err);
    });

});



module.exports = router;
