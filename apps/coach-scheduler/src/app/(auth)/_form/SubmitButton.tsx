export enum AuthFormType {
  Login = 'login',
  Signup = 'signup',
}

type AuthFormTypeKey = keyof typeof AuthFormType;
type AuthFormTypeValue = `${typeof AuthFormType[AuthFormTypeKey]}`;

export interface AuthFormProps {
  type: AuthFormTypeValue;
}

export function SubmitButton({ type }: AuthFormProps) {
  return (
    <>
      {/* <input type="hidden" name="submit" value={type} /> */}
      <input type="submit" name="submit" value={type} />
    </>
  );
}
