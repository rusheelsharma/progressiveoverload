import gql from 'graphql-tag';

export const ME_QUERY = gql`
  query me {
    me {
      name
      email
    }
  }
`;

export const EXERCISES_QUERY = gql`
  query exercises {
    exercises {
      id
      title
      sets {
        id
        reps
        weight
        createdAt
      }
    }
  }
`;

export const EXERCISE_BY_ID_QUERY = gql`
  query exerciseById($id: Int!) {
    exerciseById(id: $id) {
      id
      title
      sets {
        id
        reps
        weight
        createdAt
      }
    }
  }
`;
