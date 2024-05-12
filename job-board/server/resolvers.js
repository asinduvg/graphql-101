import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.js";
import { createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob } from "./db/jobs.js";

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
    createJob: (_root, { input: { title, description } }) => {
      const companyId = "FjcJCHJALA4i"; // TODO: Replace with the actual company ID
      return createJob({ companyId, title, description });
    },
    deleteJob: async (_root, { id }) => {
      const job = await deleteJob(id);
      if (!job) {
        throw notFoundError(`No job found with the id: ${id}`);
      }
      return job;
    },
    updateJob: async (_root, { input: { id, title, description } }) => {
      const job = await updateJob({ id, title, description });
      if (!job) {
        throw notFoundError(`No job found with the id: ${id}`);
      }
      return job;
    },
  }

};

function notFoundError(message) {
  return new GraphQLError(message, { extensions: { code: "NOT_FOUND" } });
}

function toISODate(value) {
  return value.slice(0, "YYYY-MM-DD".length);
}
