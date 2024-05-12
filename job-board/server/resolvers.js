import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.js";
import { getUser } from "./db/users.js";
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  updateJob,
} from "./db/jobs.js";

export const resolvers = {
  Query: {
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError(`No company found with the id: ${id}`);
      }
      return company;
    },
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError(`No job found with the id: ${id}`);
      }
      return job;
    },
    jobs: () => getJobs(),
  },

  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => toISODate(job.createdAt),
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },

  Mutation: {
    createJob: async (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        throw unauthorizedError("You must be logged in to create a job");
      }

      return createJob({ companyId: user.companyId, title, description });
    },
    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        throw unauthorizedError("You must be logged in to create a job");
      }
      const job = await deleteJob(id, user.companyId);
      if (!job) {
        throw notFoundError(`No job found with the id: ${id}`);
      }
    },
    updateJob: async (_root, { input: { id, title, description } }, {user}) => {
      if (!user) {
        throw unauthorizedError("You must be logged in to create a job");
      }
      const job = await updateJob({ id, title, description, companyId: user.companyId });
      if (!job) {
        throw notFoundError(`No job found with the id: ${id}`);
      }
      return job;
    },
  },
};

function notFoundError(message) {
  return new GraphQLError(message, { extensions: { code: "NOT_FOUND" } });
}

function unauthorizedError(message) {
  return new GraphQLError(message, { extensions: { code: "UNAUTHORIZED" } });
}

function toISODate(value) {
  return value.slice(0, "YYYY-MM-DD".length);
}
