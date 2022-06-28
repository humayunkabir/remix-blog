type TActionData<T> = {
  errors?: Record<keyof Partial<T>, string>;
  data: T;
};

// type TPost = {
//   id: string;
//   title: string;
//   body: string;
//   createdAt: string;
//   updatedAt: string;
// };

type TPostCreatePayload = {
  title: string;
  body: string;
  userId: string;
};

type TSigninPayload = {
  username: string;
  password: string;
};

type TSignupPayload = {
  username: string;
  password: string;
};
