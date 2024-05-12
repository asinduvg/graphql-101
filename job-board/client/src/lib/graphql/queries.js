import { GraphQLClient, gql } from "graphql-request";
import { getAccessToken } from "../auth";

const client = new GraphQLClient("http://localhost:9000/graphql", {
  headers: () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      return {
        authorization: `Bearer ${accessToken}`,
      };
    }
    return {};
  },
});

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation ($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;
  const { job } = await client.request(mutation, {
    input: { title, description },
  });
  return job;
}

export async function deleteJob(id) {
  const mutation = gql`
    mutation ($id: ID!) {
      job: deleteJob(id: $id) {
        id
      }
    }
  `;
  const { job } = await client.request(mutation, { id });
  return job;
}

export async function updateJob({ id, title, description }) {
  const mutation = gql`
    mutation ($input: UpdateJobInput!) {
      job: updateJob(input: $input) {
        title
        description
      }
    }
  `;
  const { job } = await client.request(mutation, {
    input: { id, title, description },
  });
  return job;
}

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        id
        date
        title
        company {
          id
          name
        }
      }
    }
  `;
  const { jobs } = await client.request(query);
  return jobs;
}

export async function getJob(id) {
  const query = gql`
    query ($id: ID!) {
      job(id: $id) {
        id
        date
        title
        company {
          id
          name
        }
        description
      }
    }
  `;
  const { job } = await client.request(query, { id });
  return job;
}

export async function getCompany(id) {
  const query = gql`
    query ($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          date
          title
        }
      }
    }
  `;
  const { company } = await client.request(query, { id });
  return company;
}
