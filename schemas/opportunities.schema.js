// opportunities.schema.js - Opportunities data schemas module

const config = require("../config/config");
const Joi = require("joi");
const { imageSchema } = require("./schemaUtils");

const eventDataSchema = Joi.object().pattern(/.*/, [
  Joi.object({
    title: Joi.string().required(),
    startTime: Joi.string().isoDate().allow(null),
    endTime: Joi.string().isoDate().allow(null),
    image: imageSchema,
    meetingLink: Joi.string().allow(null),
    rsvpLink: Joi.string().allow(null),
    location: Joi.string().allow(null),
    description: Joi.string().allow(null),
    otherLinks: Joi.object({
      flyerLink: Joi.string().allow(null),
      jobListing: Joi.string().allow(null),
    })
      .unknown()
      .allow(null),
    uid: Joi.string().required(),
  }).unknown(),
]);

const jobListingDataSchema = Joi.object().pattern(/.*/, [
  Joi.object({
    title: Joi.string().required(),
    timeline: Joi.object({
      openDate: Joi.string().isoDate().allow(null),
      closeDate: Joi.string().isoDate().allow(null),
    }),
    image: imageSchema,
    link: Joi.string().allow(null),
    description: Joi.string().allow(null),
    otherLinks: Joi.object({
      flyerLink: Joi.string().allow(null),
    })
      .unknown()
      .allow(null),
    uid: Joi.string().required(),
  }),
]);

const scholarshipDataSchema = Joi.object().pattern(/.*/, [
  Joi.object({
    title: Joi.string().required(),
    timeline: Joi.object({
      openDate: Joi.string().isoDate().allow(null),
      closeDate: Joi.string().isoDate().allow(null),
    }),
    image: imageSchema,
    link: Joi.string().allow(null),
    description: Joi.string().allow(null),
    otherLinks: Joi.object().unknown().allow(null),
    uid: Joi.string().required(),
  }),
]);

module.exports = {
  [`${config.apiUrl}/opportunities/events`]: eventDataSchema,
  [`${config.apiUrl}/opportunities/jobs`]: jobListingDataSchema,
  [`${config.apiUrl}/opportunities/scholarships`]: scholarshipDataSchema,
  [`${config.apiUrl}/opportunities`]: Joi.object({
    events: eventDataSchema,
    jobs: jobListingDataSchema,
    scholarships: scholarshipDataSchema,
  }),
  [`${config.devApiUrl}/opportunities/events`]: eventDataSchema,
  [`${config.devApiUrl}/opportunities/jobs`]: jobListingDataSchema,
  [`${config.devApiUrl}/opportunities/scholarships`]: scholarshipDataSchema,
  [`${config.devApiUrl}/opportunities`]: Joi.object({
    events: eventDataSchema,
    jobs: jobListingDataSchema,
    scholarships: scholarshipDataSchema,
  }),
};
