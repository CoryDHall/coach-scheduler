import { AuthForm } from '../_form/AuthForm';
import { SubmitButton } from '../_form/SubmitButton';

export default async function Login() {
  return (
    <>
      <section>
        <h2>Login</h2>
      </section>
      <AuthForm />
      <SubmitButton type="login" />
    </>
  );
}
