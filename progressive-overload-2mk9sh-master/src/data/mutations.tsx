import gql from 'graphql-tag';

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        name
        email
      }
      token
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      user {
        name
        email
      }
      token
    }
  }
`;

export const CHANGE_USERNAME_MUTATION = gql`
  mutation changeUsername($name: String!) {
    changeUsername(name: $name) {
      name
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation changePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      id
    }
  }
`;

export const DELETE_ACCOUNT_MUTATION = gql`
  mutation deleteAccount {
    deleteAccount {
      id
    }
  }
`;

export const CREATE_EXERCISE_MUTATION = gql`
  mutation createExercise($title: String!) {
    createExercise(data: { title: $title }) {
      id
    }
  }
`;

export const DELETE_EXERCISE_MUTATION = gql`
  mutation deleteExercise($id: Int!) {
    deleteExercise(id: $id) {
      id
    }
  }
`;

export const CREATE_SET_MUTATION = gql`
  mutation createSet($exerciseId: Int!, $reps: Int!, $weight: Float!) {
    createSet(data: { exerciseId: $exerciseId, reps: $reps, weight: $weight }) {
      id
    }
  }
`;

export const DELETE_SET_MUTATION = gql`
  mutation deleteSet($id: Int!) {
    deleteSet(id: $id) {
      id
    }
  }
`;
